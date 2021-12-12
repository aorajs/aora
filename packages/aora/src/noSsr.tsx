// 通过使用该HOC使得组件只在客户端进行渲染
import * as React from 'react'
import { useState, useEffect } from 'react'

export const NoSsr: React.FC = (props) => {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
      setIsClient(true)
    }, [])
    return (
      isClient ? <>{props.children}</> : <div></div>
    )
}

export default NoSsr
