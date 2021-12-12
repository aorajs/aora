// 通过使用该HOC使得组件只在客户端进行渲染
import * as React from 'react'
import { useState, useEffect } from 'react'
import { SProps } from '@aora/types'

type FC = (props: SProps) => JSX.Element

export const noSsr = (WrappedComponent: FC): FC =>  {
  return (props: SProps) => {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
      setIsClient(true)
    }, [])
    return (
      isClient ? <WrappedComponent {...props}></WrappedComponent> : <div></div>
    )
  }
}
