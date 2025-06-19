// https://stackoverflow.com/questions/75594366/react-useapi-hook-results-in-endless-loop-when-used-in-useeffect
import { DependencyList, RefObject, useState, useEffect, TouchEvent } from "react";
import { normalizeMousePosition } from "@/utils/utility";

type UseAsyncHookState<T> = {
    loading: boolean,
    error: null | Error,
    data: null | T
};

function useAsync<T>(func: () => Promise<T>, deps: DependencyList) {
    const [state, setState] = useState<UseAsyncHookState<T>>({ loading: true, error: null, data: null });

    useEffect(() => {
        let mounted = true
        func()
            .then(data => mounted && setState({ loading: false, error: null, data }))
            .catch(error => mounted && setState({ loading: false, error, data: null }))
        return () => { mounted = false }
    }, deps);

    return state;
};

interface MouseTrackerOptions {
    onMove?: (x: number, y: number) => void;
    onDown?: (x: number, y: number) => void;
    onUp?: () => void;
    moveOnlyWhenDown?: boolean;
}

export function useMouseTracker(
    canvasRef: RefObject<HTMLCanvasElement>,
    { onMove, onDown, onUp, moveOnlyWhenDown = true }: MouseTrackerOptions
) {
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseDown = (event: MouseEvent) => {
            const [x, y] = normalizeMousePosition(event.clientX, event.clientY, canvas);
            setMouseDown(true);
            onDown?.(x, y);
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!mouseDown && moveOnlyWhenDown) return;
            const [x, y] = normalizeMousePosition(event.clientX, event.clientY, canvas);
            const clampedX = Math.max(0, Math.min(x, canvas.width));
            const clampedY = Math.max(0, Math.min(y, canvas.height));
            onMove?.(clampedX, clampedY);
        };

        const handleTouchMove = (event: TouchEvent) => {
            setMouseDown(true);
            const changedTouches = event.changedTouches;

            for (let i = 0; i < changedTouches.length; i++) {
                const { clientX, clientY } = changedTouches[i];

                const [x, y] = normalizeMousePosition(clientX, clientY, canvas);
                const clampedX = Math.max(0, Math.min(x, canvas.width));
                const clampedY = Math.max(0, Math.min(y, canvas.height));
                onMove?.(clampedX, clampedY);
            }
        };

        const handleMouseUp = () => {
            setMouseDown(false);
            onUp?.();
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        // @ts-ignore
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            // @ts-ignore
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [canvasRef, mouseDown, onMove, onDown, onUp]);

    return { mouseDown };
}

export { useAsync };
