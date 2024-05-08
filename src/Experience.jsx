import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import Level from './components/Level.jsx'

export default function Experience()
{
    return <>

        <OrbitControls makeDefault />

        <Lights />
        <Level />

    </>
}