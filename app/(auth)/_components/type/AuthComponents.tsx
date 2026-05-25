export function KhelHubLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{ fontSize: size }}
      className="font-bold text-blue-600"
    >
      KhelHub
    </div>
  );
}

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-center items-center p-12 text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to KhelHub</h2>
        <p className="text-xl text-blue-100 mb-8">
          Discover and book sports facilities near you
        </p>
        <div className="w-48 h-48 bg-blue-500 rounded-full opacity-20 mx-auto"></div>
      </div>
    </div>
  );
}
