declare module 'react-india-states-map' {
    import { ComponentType } from 'react'

    interface MapLayout {
        title?: string
        legendTitle?: string
        startColor?: string
        endColor?: string
        hoverTitle?: string
        noDataColor?: string
        borderColor?: string
        hoverColor?: string
        hoverBorderColor?: string
        height?: number
        weight?: number
    }

    interface ReactDatamapsProps {
        regionData: Record<string, unknown>
        mapLayout?: MapLayout
        hoverComponent?: ComponentType<{ value: { name: string } | null }>
        onClick?: (value: { name: string }) => void
    }

    const ReactDatamaps: ComponentType<ReactDatamapsProps>
    export default ReactDatamaps
}
