import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
});

interface MermaidProps {
    chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>('');

    useEffect(() => {
        // Generate unique ID
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        let isMounted = true;

        // Asynchronously render Mermaid diagram
        mermaid.render(id, chart)
            .then((result) => {
                if (isMounted) {
                    setSvgContent(result.svg);
                }
            })
            .catch((err: any) => {
                console.error('Mermaid render error:', err);
            });

        return () => {
            isMounted = false;
        };
    }, [chart]);

    return (
        <div
            ref={ref}
            className="w-full max-w-full flex justify-center py-4 overflow-x-auto mermaid-container [&>svg]:max-w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};
