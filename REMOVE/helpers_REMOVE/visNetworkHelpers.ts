// import type { Edge, Network, Node, Options } from 'vis-network';

// import type { View } from '@/helpers/viewHelpers';

// interface VisNetworkView extends View {
//     network: Network;
// }

// let VisNetwork: typeof import('vis-network') | undefined = undefined;

// export const render = async (renderTo: HTMLElement, nodes: Node[], edges: Edge[], options: Options): Promise<VisNetworkView> => {
//     if (!VisNetwork) VisNetwork = await import('vis-network');
//     const network: Network = new VisNetwork.Network(renderTo, { edges, nodes }, options);
//     return { network, resize: () => {}, vendorId: 'visNetwork' };
// };
