import fs from 'fs';
let content = fs.readFileSync('src/components/VideoLibraryList.tsx', 'utf8');

// Remove touch states
content = content.replace(/const \[touchedCourseId, setTouchedCourseId\] = useState<string \| null>\(null\);\n/g, '');
content = content.replace(/const \[touchedLayerId, setTouchedLayerId\] = useState<string \| null>\(null\);\n/g, '');

// Update layer buttons
content = content.replace(/const isTouchedLayer = touchedLayerId === layer;\n\n\s*return \(\n\s*<button\n\s*key=\{layer\}\n\s*onClick=\{handleLayerSelect\}\n\s*onTouchStart=\{.*?\}\n\s*onTouchEnd=\{.*?\}\n\s*onTouchCancel=\{.*?\}\n\s*className=\{cn\(\n\s*"relative flex flex-col items-center justify-center py-3 min-\[375px\]:py-4 lg:py-3 px-0 min-\[375px\]:px-0\.5 sm:px-3 md:px-4 lg:px-3 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-2xl border transition-all duration-200 cursor-pointer touch-manipulation w-full min-w-0",\n\s*!isSelected && style\.hover\n\s*\)\}\n\s*style=\{isSelected\n\s*\? \{ backgroundColor: style\.activeBg\.replace\('bg-\[', ''\)\.replace\('\]', ''\), borderColor: style\.activeBorder\.replace\('border-\[', ''\)\.replace\('\]', ''\), color: 'white', zIndex: 10, boxShadow: '0 4px 6px -1px rgba\\(0, 0, 0, 0\.1\\)', transform: isTouchedLayer \? 'scale\\(0\.96\\)' : 'scale\\(1\\)' \}\n\s*: \{ borderColor: '#e2e8f0', color: '#475569', boxShadow: '0 1px 2px 0 rgba\\(0, 0, 0, 0\.05\\)', backgroundColor: isTouchedLayer \? style\.unselectedBg\?\.replace\('bg-\[', ''\)\.replace\('\]', ''\) : undefined, transform: isTouchedLayer \? 'scale\\(0\.96\\)' : 'scale\\(1\\)' \}\n\s*\}/g,
`return (
                                <button
                                    key={layer}
                                    onClick={handleLayerSelect}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center py-3 min-[375px]:py-4 lg:py-3 px-0 min-[375px]:px-0.5 sm:px-3 md:px-4 lg:px-3 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-2xl border transition-all duration-200 cursor-pointer touch-manipulation w-full min-w-0 active:scale-[0.96]",
                                        !isSelected && style.hover
                                    )}
                                    style={isSelected
                                        ? { backgroundColor: style.activeBg.replace('bg-[', '').replace(']', ''), borderColor: style.activeBorder.replace('border-[', '').replace(']', ''), color: 'white', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                                        : { borderColor: '#e2e8f0', color: '#475569', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }
                                    }`
);

// Update course items
content = content.replace(/const isTouched = touchedCourseId === course\.id;\n\n\s*return \(\n\s*<motion\.div\n\s*key=\{course\.id\}\n\s*variants=\{itemVariants\}\n\s*className="w-full"\n\s*>\n\s*<button\n\s*onClick=\{\(\) => onSelectVideo\(course\)\}\n\s*onTouchStart=\{.*?\}\n\s*onTouchEnd=\{.*?\}\n\s*onTouchCancel=\{.*?\}\n\s*style=\{\{\n\s*backgroundColor: isTouched \? activeListStyle\.tapBg : undefined,\n\s*transform: isTouched \? 'scale\\(0\.96\\)' : 'scale\\(1\\)',\n\s*transition: 'transform 0\.15s ease-out, background-color 0\.15s ease-out',\n\s*\}\}\n\s*className=\{cn\(\n\s*"group relative w-full text-left flex flex-row items-center py-4 sm:py-3 md:py-3 lg:py-2 border-b border-slate-200\/60 last:border-0 cursor-pointer overflow-hidden touch-manipulation px-2 sm:px-3 md:px-4 lg:px-3 rounded-xl",\n\s*activeListStyle\.hoverBg\n\s*\)\}\n\s*>/g,
`return (
                                <motion.div
                                    key={course.id}
                                    variants={itemVariants}
                                    className="w-full"
                                >
                                    <button
                                        onClick={() => onSelectVideo(course)}
                                        className={cn(
                                            "group relative w-full text-left flex flex-row items-center py-4 sm:py-3 md:py-3 lg:py-2 border-b border-slate-200/60 last:border-0 cursor-pointer overflow-hidden touch-manipulation px-2 sm:px-3 md:px-4 lg:px-3 rounded-xl active:scale-[0.98] transition-all duration-150 active:bg-slate-100/50",
                                            activeListStyle.hoverBg
                                        )}
                                    >`
);

// Cleanup empty icon class for touched state
content = content.replace(/className=\{cn\("w-8 h-8 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-6 lg:h-6 rounded-full flex items-center justify-center shadow-\[inset_0_1px_4px_rgba\\(0,0,0,0\.05\\)\] transition-all duration-300 md:group-hover:scale-110", isTouched \? 'bg-transparent scale-90' : 'bg-\[#FAF6ED\]'\)\}/g,
`className={cn("w-8 h-8 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-6 lg:h-6 rounded-full flex items-center justify-center shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-300 md:group-hover:scale-110 bg-[#FAF6ED]")}`);

fs.writeFileSync('src/components/VideoLibraryList.tsx', content);
