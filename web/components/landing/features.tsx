import Image from "next/image";

import {
  BriefcaseIcon,
  SparklesIcon,
  CircleStackIcon,
  UserGroupIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

export const Features: React.FC = () => {
  const features = [
    {
      icon: SparklesIcon,
      name: "AI content creation",
      description: "Create content with the power of AI",
    },
    {
      icon: CircleStackIcon,
      name: "Knowledge Base",
      description:
        "Upload and store information about your brand, so your content is always accurate",
    },
    {
      icon: UserGroupIcon,
      name: "Team Collaboration",
      description:
        "Add members on project to work together with permissions in mind.",
    },
    {
      icon: CodeBracketIcon,
      name: "Open source",
      description:
        "GENETERA AI is proudly Open-source, released under the AGPL-3.0 license",
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
                  AI-Powered content generator.
                </h3>
                <p className="mb-8 text-lg text-zinc-700">
                  Generate content with the world&lsquo;s most powerful AI .
                </p>
                <dl className="max-w-xl grid grid-cols-1 gap-4 lg:max-w-none">
                  {features.map((feature) => (
                    <div
                      key={feature.name}
                      className="p-3 rounded group bg-green-50 hover:bg-zink-300 duration-500"
                    >
                      <div className="flex items-center mb-1 space-x-2 ">
                        <feature.icon className="w-4 h-4 shrink-0 text-zinc-900 group-hover:text-zinc-950 duration-500 font-bold" />
                        <h4 className="text-zinc-900 group-hover:text-zinc-950 duration-500 font-bold">
                          {feature.name}
                        </h4>
                      </div>
                      <p className="text-sm text-left text-zinc-800 group-hover:text-zinc-850 duration-500 font-medium">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex max-w-2xl mx-auto mt-16 md:w-5/12 lg:w-1/2 sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
                <div className="z-10 flex-none max-w-3xl sm:max-w-5xl lg:max-w-none">
                  <Image
                    src="/images/dashboard.png"
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
