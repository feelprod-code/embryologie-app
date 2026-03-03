const fs = require('fs');

const path = 'src/components/VideoPlayerPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Insert layerColors and EmbryoLayer type if they don't exist
if (!content.includes('type EmbryoLayer =')) {
  const layerDefs = `
type EmbryoLayer = "Ectoderme" | "Mésoderme" | "Endoderme" | "L'Oeil" | "Global" | "N/A";
const layerColors: Record<EmbryoLayer, string> = {
    "Ectoderme": "bg-blue-50 text-blue-700 border-blue-200",
    "Mésoderme": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Endoderme": "bg-red-50 text-red-700 border-red-200",
    "L'Oeil": "bg-amber-50 text-amber-700 border-amber-200",
    "Global": "bg-slate-100 text-slate-700 border-slate-200",
    "N/A": "bg-transparent text-slate-400 border-transparent",
};
`;
  content = content.replace(/(interface VideoPlayerPageProps {)/, layerDefs + '\n$1');
}

// Implement handleCategoryClick inside VideoPlayerPage
if (!content.includes('handleCategoryClick')) {
  const handler = `
  const handleCategoryClick = (layer: string) => {
    let target = 'ectoderme';
    if (layer === 'Mésoderme') target = 'mesoderme';
    if (layer === 'Endoderme') target = 'endoderme';
    if (layer === "L'Oeil") target = 'oeil';
    
    if (target === course.categoryId) return;
    const firstCourse = videoCourses.find(v => v.categoryId === target);
    if (firstCourse) onSelectVideo(firstCourse);
  };
`;
  content = content.replace(/(const handleSpeedChange = [^}]+};\n)/, '$1' + handler);
}

// Replace the compact controls to restore the big prev/next buttons
const oldCompact = content.match(/\{\/\* COMPACT CONTROLS \*\/\}[\s\S]*?(?=\<\/div\>\n\s*\<\/div\>\n\s*\<\/div\>\n\s*\{\/\* Right Column)/);
if (oldCompact) {
   const newControls = `
            {/* Speed & Download */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
              <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-md border border-slate-200">
                {[1, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={\`px-2 py-1 rounded text-[10px] font-bold transition-colors \${currentSpeed === speed
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                      }\`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {course.cloudflareId && (
                <a
                  href={\`https://customer-6i2z59dst7q6iswv.cloudflarestream.com/\${course.cloudflareId}/downloads/default.mp4\`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-dark hover:bg-slate-800 transition-colors rounded-md shadow-sm ml-auto mr-2"
                >
                  <DownloadCloud size={14} />
                  <span>Cache hors-ligne</span>
                </a>
              )}
            </div>

            {/* PREV/NEXT BUTTONS */}
            <div className="flex items-center justify-between gap-3 mt-2">
                <button
                    onClick={() => prevVideo && onSelectVideo(prevVideo)}
                    disabled={!prevVideo}
                    className="flex-1 flex justify-center items-center py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bebas tracking-wide text-sm sm:text-base rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-slate-200"
                >
                    <ChevronLeft size={18} className="mr-1" /> Précédent
                </button>
                <button
                    onClick={() => nextVideo && onSelectVideo(nextVideo)}
                    disabled={!nextVideo}
                    className="flex-1 flex justify-center items-center py-2.5 sm:py-3 bg-dark hover:bg-black text-white font-bebas tracking-wide text-sm sm:text-base rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    Suivant <ChevronRight size={18} className="ml-1" />
                </button>
            </div>
`;
   content = content.replace(oldCompact[0], newControls);
}

// Now insert the TABS
const tabsJSX = `
        {/* Layer Tabs */}
        <div className="w-full px-2 sm:px-0 mb-3 shrink-0">
          <div className="flex justify-between items-center bg-white p-1.5 sm:p-2 rounded-xl border border-slate-200 shadow-sm mx-auto relative z-20 w-full">
              {["Ectoderme", "Mésoderme", "Endoderme", "L'Oeil"].map(layer => {
                  let lmap = { "Ectoderme": "ectoderme", "Mésoderme": "mesoderme", "Endoderme": "endoderme", "L'Oeil": "oeil" };
                  const isSelected = course.categoryId === lmap[layer as keyof typeof lmap];
                  const colorClass = layerColors[layer as EmbryoLayer];

                  return (
                      <button
                          key={layer}
                          onClick={() => handleCategoryClick(layer)}
                          className={\`flex-1 px-1 py-1.5 sm:px-3 sm:py-2 mx-0.5 rounded-md sm:rounded-lg text-[10px] min-[380px]:text-xs sm:text-sm whitespace-nowrap font-bold transition-all duration-300 border shadow-sm tracking-tight \${isSelected ? colorClass : "bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200 hover:text-slate-800"}\`}
                      >
                          {layer}
                      </button>
                  )
              })}
          </div>
        </div>
`;

if (!content.includes('Layer Tabs')) {
  content = content.replace(/(<div className="flex flex-col lg:flex-row gap-2 lg:gap-8)/, tabsJSX + '\n      $1');
}

fs.writeFileSync(path, content);
