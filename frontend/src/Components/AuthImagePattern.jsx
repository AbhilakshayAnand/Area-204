const AuthImagePattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-16">
        <div className="max-w-lg text-center space-y-6">
          {/* Pattern Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl bg-primary/10 shadow-md ${
                  i % 2 === 0 ? "animate-pulse" : "bg-primary/5"
                }`}
              />
            ))}
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-extrabold text-primary mb-2">
            {title || "Welcome!"}
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg text-base-content/70 leading-relaxed">
            {subtitle || "We are excited to have you here. Let's get started!"}
          </p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;
  