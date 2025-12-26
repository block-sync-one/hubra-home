export interface ProtocolOption {
  name: string;
  slug: string;
}

export interface ProtocolSelectorProps {
  currentProtocol: {
    name: string;
    slug: string;
  };
  relatedProtocols: ProtocolOption[];
}
