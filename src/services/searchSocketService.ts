// src/services/searchSocketService.ts

import { io, type Socket } from "socket.io-client";

export interface StreamedProduct {
  id: string;
  title: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  productUrl?: string;
  source: string;
  rating?: number;
  reviewCount?: number;
  isSponsored?: boolean;
  badge?: string;
  condition?: string;
  shipping?: string;
  hasFreeShipping?: boolean;
}

export interface ProductScore {
  productId: string;
  relevanceScore: number;
  aiReasoning: string;
}

export interface StreamStats {
  source: string;
  pageComplete?: number;
  productsFound?: number;
  platformStats: Record<string, { total: number; completed: boolean }>;
}

export interface StreamComplete {
  searchId: string;
  totalProducts: number;
  platformStats: Record<string, { total: number; completed: boolean }>;
  durationMs: number;
}

export interface StreamError {
  source: string;
  error: string;
}

export interface SearchCallbacks {
  onProduct: (
    products: StreamedProduct[],
    scores: ProductScore[],
    searchId: string,
  ) => void;
  onStats: (stats: StreamStats, searchId: string) => void;
  onComplete: (summary: StreamComplete) => void;
  onError: (error: StreamError) => void;
  onSearchStarted?: (data: { searchId: string; query: string }) => void;
  onCancelled?: () => void;
}

/**
 * Socket.IO Client Service for Real-Time Product Search
 *
 * Replaces SSE with WebSocket for bidirectional communication
 * Supports:
 * - Real-time streaming
 * - Search cancellation
 * - Automatic reconnection
 * - Clean resource management
 */
export class SearchSocketService {
  private socket: Socket | null = null;
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  private isSearching = false;
  private currentSearchId: string | null = null;

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("token") ||
      this.getCookie("token") ||
      this.getCookie("accessToken")
    );
  }

  /**
   * Get cookie value by name
   */
  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }

  /**
   * Connect to Socket.IO server with authentication
   */
  private connect(token: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      this.socket = io(`${this.baseUrl}/search`, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on("connected", (data) => {
        console.log("✅ Connected to search server:", data);
        resolve(this.socket!);
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Connection error:", error);
        reject(new Error("Failed to connect to search server"));
      });

      this.socket.on("error", (data) => {
        console.error("❌ Server error:", data);
        if (
          data.message?.includes("Authentication") ||
          data.message?.includes("token")
        ) {
          reject(new Error("Authentication failed. Please log in again."));
        }
      });

      this.socket.on("disconnect", (reason) => {
        console.log("👋 Disconnected from search server:", reason);
        this.isSearching = false;
        this.currentSearchId = null;
      });
    });
  }

  /**
   * Start a new search stream
   *
   * @param query - Search query
   * @param callbacks - Event handlers for stream events
   * @param options - Additional options (maxPages, custom token)
   * @returns Promise with searchId and cancel function
   */
  async startSearch(
    query: string,
    callbacks: SearchCallbacks,
    options: { maxPages?: number; customToken?: string } = {},
  ): Promise<{ searchId: string | null; cancel: () => void }> {
    const { maxPages = 1, customToken } = options;

    // Get authentication token
    const token = customToken || this.getAuthToken();
    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    // Cancel existing search if any
    if (this.isSearching) {
      this.cancelSearch();
    }

    try {
      // Connect to server
      await this.connect(token);

      if (!this.socket) {
        throw new Error("Failed to establish socket connection");
      }

      // Set up event listeners
      this.socket.off("searchStarted");
      this.socket.off("product");
      this.socket.off("stats");
      this.socket.off("complete");
      this.socket.off("searchComplete");
      this.socket.off("error");
      this.socket.off("searchCancelled");

      this.socket.on("searchStarted", (data) => {
        console.log("🚀 Search started:", data);
        this.isSearching = true;
        this.currentSearchId = data.searchId;
        callbacks.onSearchStarted?.(data);
      });

      this.socket.on("product", (data) => {
        console.log(`📦 Received ${data.products?.length || 0} products`);
        if (data.products && data.searchId) {
          callbacks.onProduct(data.products, data.scores || [], data.searchId);
        }
      });

      this.socket.on("stats", (data) => {
        console.log("📊 Stats update:", data);
        if (data.searchId) {
          callbacks.onStats(data, data.searchId);
        }
      });

      this.socket.on("complete", (data) => {
        console.log("✅ Search complete:", data);
        this.isSearching = false;
        callbacks.onComplete(data);
      });

      this.socket.on("searchComplete", (data) => {
        console.log("🏁 Search finalized:", data);
        this.isSearching = false;
      });

      this.socket.on("error", (data) => {
        console.error("❌ Stream error:", data);
        callbacks.onError(data);
      });

      this.socket.on("searchCancelled", (data) => {
        console.log("🛑 Search cancelled:", data);
        this.isSearching = false;
        this.currentSearchId = null;
        callbacks.onCancelled?.();
      });

      // Start search
      this.socket.emit("startSearch", { query, maxPages });

      return {
        searchId: this.currentSearchId,
        cancel: () => this.cancelSearch(),
      };
    } catch (error) {
      console.error("Failed to start search:", error);
      this.disconnect();
      throw error;
    }
  }

  /**
   * Cancel active search
   */
  cancelSearch(): void {
    if (!this.socket || !this.isSearching) {
      console.log("No active search to cancel");
      return;
    }

    console.log("🛑 Cancelling search...");
    this.socket.emit("cancelSearch");
    this.isSearching = false;
    this.currentSearchId = null;
  }

  /**
   * Get current search status
   */
  async getStatus(): Promise<void> {
    if (!this.socket?.connected) {
      console.log("Not connected to server");
      return;
    }

    this.socket.emit("getStatus");
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      console.log("Disconnecting from search server...");
      this.socket.disconnect();
      this.socket = null;
      this.isSearching = false;
      this.currentSearchId = null;
    }
  }

  /**
   * Check if currently searching
   */
  isActivelySearching(): boolean {
    return this.isSearching;
  }

  /**
   * Get current search ID
   */
  getCurrentSearchId(): string | null {
    return this.currentSearchId;
  }
}

// Singleton instance
export const searchSocketService = new SearchSocketService();
