import Image from "next/image";

import { BriefcaseIcon } from "@heroicons/react/24/outline";

export const Features: React.FC = () => {
  const features = [
    {
      icon: BriefcaseIcon,
      name: "Consolidate Events",
      description: "Get all your event data in one place to reduce alert noise",
    },
    {
      icon: BriefcaseIcon,
      name: "Stay Focused",
      description: "Keep your Slack workspace focused on what's important",
    },
    {
      icon: BriefcaseIcon,
      name: "Customizable Settings",
      description: "Customize your alert settings to suit your unique needs",
    },
    {
      icon: BriefcaseIcon,
      name: "Clear Overview",
      description: "Get a clear overview of all your alerts in one place",
    },
  ];
  return (
    <section className="bg-slate-50" style={{ overflowX: "hidden" }}>
      <div className="relative max-w-6xl px-4 mx-auto sm:px-6">
        <div className=" pb-12 md:pt-52 md:pb-20">
          <div>
            {/* Section content */}
            <div className="flex flex-col max-w-xl mx-auto md:max-w-none md:flex-row md:space-x-8 lg:space-x-16 xl:space-x-20 space-y-8 space-y-reverse md:space-y-0">
              {/* Content */}
              <div
                className="order-1 md:w-7/12 lg:w-1/2 md:order-none max-md:text-center"
                data-aos="fade-down"
              >
                {/* Content #1 */}
                <h3 className="pb-3 text-4xl font-bold  text-zinc-900">
                  Generate content with AI
                </h3>
                <p className="mb-8 text-lg text-zinc-700">
                  Write exceptional copy with the world's most powerful AI text
                  editor
                </p>
                <dl className="max-w-xl grid grid-cols-1 gap-4 lg:max-w-none">
                  {features.map((feature) => (
                    <div
                      key={feature.name}
                      className="px-2 py-1 rounded group bg-zinc-100 hover:bg-zink-300 duration-500"
                    >
                      <div className="flex items-center mb-1 space-x-2 ">
                        <feature.icon className="w-4 h-4 shrink-0 text-zinc-900 group-hover:text-zinc-950 duration-500" />
                        <h4 className="font-medium text-zinc-900 group-hover:text-zinc-950 duration-500">
                          {feature.name}
                        </h4>
                      </div>
                      <p className="text-sm text-left text-zinc-400 group-hover:text-zinc-950 duration-500">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex max-w-2xl mx-auto mt-16 md:w-5/12 lg:w-1/2 sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                <div className="z-10 flex-none max-w-3xl sm:max-w-5xl lg:max-w-none">
                  <Image
                    src="/images/genetera.png"
                    alt="App screenshot"
                    width={2432}
                    height={1442}
                    className="w-[76rem] z-10 rounded-xl border border-zinc-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
