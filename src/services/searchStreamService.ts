// src/services/searchStreamService.ts

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
  // ... other fields
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

export interface StreamCallbacks {
  onProduct: (products: StreamedProduct[], searchId: string) => void;
  onStats: (stats: StreamStats, searchId: string) => void;
  onComplete: (summary: StreamComplete) => void;
  onError: (error: StreamError) => void;
}

export class SearchStreamService {
  private eventSource: EventSource | null = null;
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    // Try to get token from localStorage, sessionStorage, or cookies
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
   * Start streaming search results with authentication
   * Returns searchId for tracking
   */
  async streamSearch(
    query: string,
    callbacks: StreamCallbacks,
    customToken?: string, // Optional: allow passing token directly
  ): Promise<{ searchId: string | null; cancel: () => void }> {
    let searchId: string | null = null;

    return new Promise((resolve, reject) => {
      try {
        // Get authentication token
        const token = customToken || this.getAuthToken();

        if (!token) {
          reject(new Error("Authentication required. Please log in."));
          return;
        }

        // Build URL with token as query parameter (for SSE)
        // Note: EventSource doesn't support custom headers, so we use query params
        const url = `${this.baseUrl}/search/stream?q=${encodeURIComponent(query)}&token=${encodeURIComponent(token)}`;

        this.eventSource = new EventSource(url);

        // Handle 'product' events
        this.eventSource.addEventListener("product", (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            searchId = data.searchId;

            if (data.products && Array.isArray(data.products) && searchId) {
              callbacks.onProduct(data.products, searchId);
            }
          } catch (error) {
            console.error("Error parsing product event:", error);
          }
        });

        // Handle 'stats' events
        this.eventSource.addEventListener("stats", (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            searchId = data.searchId;
            if (searchId) {
              callbacks.onStats(data, searchId);
            }
          } catch (error) {
            console.error("Error parsing stats event:", error);
          }
        });

        // Handle 'complete' events
        this.eventSource.addEventListener("complete", (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            searchId = data.searchId;
            callbacks.onComplete(data);
            this.close();
            resolve({ searchId, cancel: () => this.close() });
          } catch (error) {
            console.error("Error parsing complete event:", error);
            this.close();
            reject(error);
          }
        });

        // Handle 'error' events from backend
        this.eventSource.addEventListener("error", (event: MessageEvent) => {
          try {
            if (event.data) {
              const data = JSON.parse(event.data);
              callbacks.onError(data);
            }
          } catch (error) {
            console.error("Error parsing error event:", error);
          }
        });

        // Handle connection errors
        this.eventSource.onerror = (error) => {
          console.error("SSE connection error:", error);
          this.close();

          // Check if it's an authentication error
          if (this.eventSource?.readyState === EventSource.CLOSED) {
            reject(new Error("Authentication failed. Please log in again."));
          } else {
            reject(new Error("Connection to server failed"));
          }
        };

        // Initial resolution with cancel function
        // Actual searchId will be available after first event
        setTimeout(() => {
          resolve({ searchId, cancel: () => this.close() });
        }, 100);
      } catch (error) {
        console.error("Failed to create EventSource:", error);
        reject(error);
      }
    });
  }

  /**
   * Close the SSE connection
   */
  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log("SSE connection closed");
    }
  }

  /**
   * Check if connection is active
   */
  isConnected(): boolean {
    return (
      this.eventSource !== null &&
      this.eventSource.readyState === EventSource.OPEN
    );
  }
}

// Singleton instance
export const searchStreamService = new SearchStreamService();
