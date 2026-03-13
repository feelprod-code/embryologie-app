import fs from 'fs';

let content = fs.readFileSync('src/components/VideoPlayerPage.tsx', 'utf8');

// Remove state declarations
content = content.replace(/const \[touchedTab, setTouchedTab\] = useState<string \| null>\(null\);\n\s*/g, '');

// Clean layer button
content = content.replace(/const isTouched = touchedTab === layer;\n\n\s*return \(\n\s*<button([\s\S]*?)onTouchStart=\{.*?\}\n\s*onTouchEnd=\{.*?\}\n\s*onTouchCancel=\{.*?\}\n\s*className=\{cn\([\s\S]*?\)\}\n\s*style=\{isSelected \? \{[\s\S]*?transform: isTouched \? 'scale\(0\.96\)' : 'scale\(1\.02\)'\n\s*\} : \{\n\s*transform: isTouched \? 'scale\(0\.96\)' : 'scale\(1\)'\n\s*\}\}/g,
`return (
                                <button$1className={cn(
                                        "relative px-4 sm:px-6 md:px-7 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 rounded-xl sm:rounded-2xl transition-all duration-200 flex-1 sm:flex-none min-w-[120px] flex flex-col items-center justify-center touch-manipulation active:scale-[0.96]",
                                        isSelected
                                            ? "bg-white text-slate-900 shadow-md shadow-black/5 ring-1 ring-black/5 scale-[1.02]"
                                            : "bg-white/50 hover:bg-white text-slate-500 hover:text-slate-800 border border-transparent hover:border-slate-200/50"
                                    )}
                                    style={isSelected ? {
                                        backgroundColor: style.activeBg.replace('bg-[', '').replace(']', ''),
                                        borderColor: style.activeBorder.replace('border-[', '').replace(']', ''),
                                        color: 'white'
                                    } : {}}`
);

fs.writeFileSync('src/components/VideoPlayerPage.tsx', content);
