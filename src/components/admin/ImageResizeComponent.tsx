import { NodeViewWrapper } from '@tiptap/react';
import React, { useCallback, useEffect, useState, useRef } from 'react';

const ResizableImage = (props: any) => {
    const { node, updateAttributes, selected } = props;
    const [width, setWidth] = useState<string | number>(node.attrs.width || '100%');
    const [isResizing, setIsResizing] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const startXRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);

    useEffect(() => {
        setWidth(node.attrs.width || '100%');
    }, [node.attrs.width]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (imageRef.current) {
            startWidthRef.current = imageRef.current.offsetWidth;
            startXRef.current = e.clientX;
            setIsResizing(true);

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!imageRef.current) return;

        const currentX = e.clientX;
        const diffX = currentX - startXRef.current;
        const newWidth = Math.max(50, startWidthRef.current + diffX); // Min width 50px

        // Convert key-value to percentage if container is fluid, but pixels are easier for direct resize 
        // Let's stick to pixels for precision during resize, or percentage if user wants.
        // For simplicity, we'll use pixels, but maybe convert to % if parent is known? 
        // Let's just use pixels for now as it's standard for resize handles.
        setWidth(newWidth);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Save the final width
        if (imageRef.current) {
            updateAttributes({ width: imageRef.current.offsetWidth });
        }
    }, [updateAttributes, handleMouseMove]);

    const align = node.attrs.align || 'center';

    let wrapperStyle: React.CSSProperties = {
        position: 'relative',
        display: 'inline-block',
        lineHeight: 0,
        ...((align === 'left') ? { float: 'left', marginRight: '1.5em', marginBottom: '1em' } : {}),
        ...((align === 'right') ? { float: 'right', marginLeft: '1.5em', marginBottom: '1em' } : {}),
        ...((align === 'center') ? { display: 'block', margin: '1em auto' } : {}),
    };

    return (
        <NodeViewWrapper as="span" className="image-resizer-container" style={wrapperStyle}>
            <img
                ref={imageRef}
                src={node.attrs.src}
                alt={node.attrs.alt}
                data-drag-handle
                style={{
                    width: typeof width === 'number' ? `${width}px` : width,
                    maxWidth: '100%',
                    height: 'auto',
                    border: selected ? '2px solid var(--neon-cyan)' : '1px solid transparent',
                    boxShadow: selected ? '0 0 10px rgba(0, 255, 255, 0.2)' : 'none',
                    transition: isResizing ? 'none' : 'all 0.2s',
                    display: 'block'
                }}
            />
            {selected && (
                <>
                    <div
                        className="resize-handle"
                        onMouseDown={handleMouseDown}
                        style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: 'var(--neon-cyan)',
                            cursor: 'nwse-resize',
                            border: '1px solid #000',
                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                            zIndex: 10
                        }}
                    />
                    <div className="alignment-controls" style={{
                        position: 'absolute',
                        bottom: '-40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '4px',
                        backgroundColor: '#000',
                        padding: '4px',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        zIndex: 20
                    }}>
                        {['left', 'center', 'right'].map((align) => (
                            <button
                                key={align}
                                onClick={() => updateAttributes({ align })}
                                style={{
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    backgroundColor: node.attrs.align === align ? 'var(--neon-cyan)' : '#222',
                                    color: node.attrs.align === align ? '#000' : '#888',
                                    border: 'none',
                                    borderRadius: '2px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {align}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </NodeViewWrapper>
    );
};

export default ResizableImage;
