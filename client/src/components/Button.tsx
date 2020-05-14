import * as React from "react";
import CancelIcon from '@material-ui/icons/Cancel';

export interface ButtonProps {
    onClick?: VoidFunction;
    color?: 'green' | 'coral' | 'gray' | 'red'
    text?: 'white' | 'green' | 'coral' | 'gray'
    full?: boolean
    type?: 'cancel' | 'normal'
}

export const ButtonUI: React.FunctionComponent<ButtonProps> = ({ onClick, children, color = 'green', text = 'white', full, type = 'normal' }) => {
    if (type === 'cancel') {
        return (
            <button onClick={onClick} className="outline-none border-none bg-transparent m-0 p-0"><CancelIcon style={{ color: '#F25757' }} /></button>
        )
    }

    if (full) {
        return (
            <button onClick={onClick} className={`bg-${color} hover:bg-${color} text-white font-bold py-2 px-4 rounded outline-none m-1`}>
                {children}
            </button>
        )
    }

    return (
        <button onClick={onClick} className={`bg-transparent hover:bg-${color} text-${color} font-semibold hover:text-white py-2 px-4 border border-${color} hover:border-transparent rounded outline-none`} > {children}</button >
    );
}