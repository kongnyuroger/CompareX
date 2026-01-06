"use client";

export default function RobotLoader() {
  return (
    <div className="flex justify-center items-center h-50">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes antennaWiggle {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(-30deg); }
        }

        @keyframes antennaWiggleRight {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(30deg); }
        }

        @keyframes displayPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes dotPulse {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes particleFloat {
          0% {
            bottom: -20px;
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          100% {
            bottom: 30px;
            opacity: 0;
          }
        }

        .robot-container {
          animation: float 3s ease-in-out infinite;
        }

        .antenna-left {
          animation: antennaWiggle 2s ease-in-out infinite;
        }

        .antenna-right {
          animation: antennaWiggleRight 2s ease-in-out infinite 0.5s;
        }

        .display-pulse {
          animation: displayPulse 2s ease-in-out infinite;
        }

        .glow-effect {
          animation: glow 2s ease-in-out infinite;
        }

        .particle {
          animation: particleFloat 3s ease-in-out infinite;
        }

        .particle:nth-child(1) {
          animation-delay: 0s;
        }

        .particle:nth-child(2) {
          animation-delay: 1s;
        }

        .particle:nth-child(3) {
          animation-delay: 2s;
        }

        .dot {
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        .dot:nth-child(4) { animation-delay: 0.45s; }
        .dot:nth-child(5) { animation-delay: 0.6s; }
        .dot:nth-child(6) { animation-delay: 0.75s; }
        .dot:nth-child(7) { animation-delay: 0.9s; }
        .dot:nth-child(8) { animation-delay: 1.05s; }
      `}</style>

      <div className="relative robot-container">
        <div className="w-[280px] h-[280px] relative">
          {/* Particles */}
          <div className="particle absolute w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 left-[30%]"></div>
          <div className="particle absolute w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 left-[70%]"></div>
          <div className="particle absolute w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 left-1/2"></div>

          {/* Antennas */}
          <div className="antenna-left absolute w-1 h-[30px] bg-[#0A1F5C] rounded-sm left-[45px] top-2.5 rotate-[-20deg]">
            <div className="absolute w-4 h-4 bg-[#0A1F5C] rounded-full top-[-8px] left-1/2 -translate-x-1/2"></div>
          </div>
          <div className="antenna-right absolute w-1 h-[30px] bg-[#0A1F5C] rounded-sm right-[45px] top-2.5 rotate-[20deg]">
            <div className="absolute w-4 h-4 bg-[#0A1F5C] rounded-full top-[-8px] left-1/2 -translate-x-1/2"></div>
          </div>

          {/* Top Display */}
          <div className="display-pulse absolute w-[120px] h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl top-[35px] left-1/2 -translate-x-1/2 shadow-[0_4px_15px_rgba(0,180,216,0.4)]"></div>

          {/* Head */}
          <div className="absolute w-[240px] h-[180px] bg-gradient-to-br from-blue-50 to-blue-100 border-[6px] border-[#0A1F5C] rounded-[50px] top-[65px] left-1/2 -translate-x-1/2 shadow-[0_10px_30px_rgba(10,31,92,0.2)]">
            <div className="glow-effect absolute w-full h-full rounded-[50px] bg-[radial-gradient(circle_at_center,_rgba(0,180,216,0.2),_transparent)]"></div>

            {/* Visor/Screen */}
            <div className="absolute w-[180px] h-[100px] bg-primary rounded-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20">
                <div className="dot absolute w-3 h-3 bg-white rounded-full opacity-0 top-0 left-1/2 -translate-x-1/2"></div>
                <div className="dot absolute w-3 h-3 bg-white rounded-full opacity-0 top-2.5 right-2.5"></div>
                <div className="dot absolute w-3 h-3 bg-white rounded-full opacity-0 top-1/2 right-0 -translate-y-1/2"></div>
                <div className="dot absolute w-3 h-3 bg-white rounded-full opacity-0 bottom-2.5 right-2.5"></div>
                <div className="dot absolute w-3 h-3 bg-white rounded-full opacity-0 bottom-0 left-1/2 -translate-x-1/2"></div>
                <div className="dot absolute w-3 h-3 bg-white rounded-full opacity-0 bottom-2.5 left-2.5"></div>
                <div className="dot absolute w-3 h-3 bg-white rounded-full opacity-0 top-1/2 left-0 -translate-y-1/2"></div>
                <div className="dot absolute w-3 h-3 bg-white rounded-full opacity-0 top-2.5 left-2.5"></div>
              </div>
            </div>
          </div>

          {/* Ears/Handles */}
          <div className="absolute w-[30px] h-[60px] bg-blue-50 border-[6px] border-[#0A1F5C] border-r-0 rounded-l-[20px] top-[110px] left-0"></div>
          <div className="absolute w-[30px] h-[60px] bg-blue-50 border-[6px] border-[#0A1F5C] border-l-0 rounded-r-[20px] top-[110px] right-0"></div>
        </div>
      </div>
    </div>
  );
}
