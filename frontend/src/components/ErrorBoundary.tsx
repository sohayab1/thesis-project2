import { Component, ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                    <Button onClick={() => window.location.reload()}>
                        Try again
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}