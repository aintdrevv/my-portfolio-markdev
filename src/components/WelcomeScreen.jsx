const welcomeImages = [
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&fm=jpg&q=80&w=1600',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&fm=jpg&q=80&w=1600',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&q=80&w=1600',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&fm=jpg&q=80&w=1600',
]

const imagePositions = ['center center', 'center 40%', 'center center', 'center 30%']

function WelcomeScreen({ onEnter }) {
  const marqueeImages = [...welcomeImages, ...welcomeImages]

  return (
    <div className="fixed inset-0 z-[200] bg-[#0d0f11]">
      <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex min-h-0 flex-col justify-center px-6 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-[30rem]">
            <p className="font-dm-mono text-[0.68rem] uppercase tracking-[0.34em] text-white/34">
              Welcome
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Mark Macaraig
            </h1>
            <p className="mt-4 text-[0.78rem] uppercase tracking-[0.34em] text-[#93a66b]">
              Frontend Developer
            </p>
            <p className="mt-8 max-w-[26rem] text-base leading-8 text-white/66 sm:text-[1.02rem]">
              Designing and building simple, refined, and modern digital experiences.
            </p>
            <button
              type="button"
              onClick={onEnter}
              className="mt-10 inline-flex h-12 items-center bg-white px-6 text-sm font-medium uppercase tracking-[0.18em] text-[#0d0f11] transition hover:bg-[#93a66b]"
            >
              Enter Portfolio
            </button>
          </div>
        </div>

        <div className="relative hidden h-full min-h-0 overflow-hidden lg:block">
          <div className="welcome-marquee-track absolute inset-0 flex flex-col">
            {marqueeImages.map((image, index) => (
              <div key={`${image}-${index}`} className="h-[50vh] w-full shrink-0 overflow-hidden bg-[#090b0d]">
                <img
                  src={image}
                  alt=""
                  aria-hidden="true"
                  className="block h-full w-full object-cover"
                  style={{ objectPosition: imagePositions[index % welcomeImages.length] }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-black/24" />
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
