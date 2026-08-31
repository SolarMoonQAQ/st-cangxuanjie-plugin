export type ContentNode =
    | {
          kind: 'dialogue'
          data: {
              speaker: string
              content: string
          }
      }
    | {
          kind: 'narration'
          children: ContentNode[]
      }
    | {
          kind: 'native-dom'
          data: {
              node: Node
          }
      }
