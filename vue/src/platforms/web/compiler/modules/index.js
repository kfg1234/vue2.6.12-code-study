import klass from './class'
import style from './style'
import model from './model'

/*
  [
    {
      staticKeys: ['staticClass'],
      transformNode,
      genData
    },
    {
      staticKeys: ['staticStyle'],
      transformNode,
      genData
    },
    {
      preTransformNode
    }
  ]
*/
export default [
  klass,
  style,
  model
]
