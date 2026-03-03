const fs = require('fs');

const path = 'src/components/VideoPlayerPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// The file has a syntax error. We'll rebuild the end of Left column properly.
content = content.replace(/<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\{\/\* Right Column/g, '</div>\n        </div>\n\n        {/* Right Column');

// Now we insert the tabs BEFORE <div className="flex flex-col lg:flex-row ...">
if (!content.includes('Layer Tabs')) {
  const tabsJSX = `
      {/* Layer Tabs */}
      <div className="w-full px-2 sm:px-0 mb-3 shrink-0">
        <div className="flex justify-between items-center bg-white p-1.5 sm:p-2 rounded-xl border border-slate-200 shadow-sm mx-auto relative z-20 w-full overflow-x-auto no-scrollbar">
            {["Ectoderme", "Mésoderme", "Endoderme", "L'Oeil"].map(layer => {
                let lmap = { "Ectoderme": "ectoderme", "Mésoderme": "mesoderme", "Endoderme": "endoderme", "L'Oeil": "oeil" };
                const cId = lmap[layer as keyof typeof lmap];
                const isSelected = course.categoryId === cId;
                
                const handleLayerClick = () => {
                    if (isSelected) return;
                    const firstCourse = videoCourses.find(v => v.categoryId === cId);
                    if (firstCourse) onSelectVideo(firstCourse);
                };

                const layerColors: Record<string, string> = {
                    "Ectoderme": "bg-blue-50 text-blue-700 border-blue-200",
                    "Mésoderme": "bg-emerald-50 text-emerald-700 border-emerald-200",
                    "Endoderme": "bg-red-50 text-red-700 border-red-200",
                    "L'Oeil": "bg-amber-50 text-amber-700 border-amber-200"
                };
                const colorClass = layerColors[layer] || "";

                return (
                    <button
                        key={layer}
                        onClick={handleLayerClick}
                        className={\`flex-1 px-1 py-1.5 sm:px-3 sm:py-2 mx-0.5 rounded-md sm:rounded-lg text-[10px] min-[380px]:text-xs sm:text-sm whitespace-nowrap font-bold transition-all duration-300 border shadow-sm tracking-tight \${isSelected ? colorClass : "bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200 hover:text-slate-800"}\`}
                    >
                        {layer}
                    </button>
                )
            })}
        </div>
      </div>
`;
  content = content.replace(/(<div className="flex flex-col lg:flex-row)/, tabsJSX + '\n      $1');
}

fs.writeFileSync(path, content);
