import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from "../../lib/useClickOutside";

type ColorPickerProps = {
    color: string
    onChange(newColor: string): void
    text: string
}
export const ColorPicker = ({ color, onChange, text }: ColorPickerProps) => {
    const popover = useRef(null);
    const [isOpen, toggle] = useState(false);

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <div className="p-1 justify-between flex">
            <div className="relative ">
                <div
                    className="w-7 h-7 shadow-[0_0_0_1px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.1)] cursor-pointer rounded-lg border-[3px] border-solid border-white"
                    style={{ backgroundColor: color }}
                    onClick={() => toggle(true)}
                />
                {isOpen && (
                    <div className="absolute z-10 rounded-full left-0" ref={popover}>
                        <HexColorPicker color={color} onChange={onChange} />
                    </div>
                )}
            </div>

            <span className='text-black ml-3'>{text}</span>
            <span className='text-black ml-auto'>{color}</span>
        </div>
    );
};
