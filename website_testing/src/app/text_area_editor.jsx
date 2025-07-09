'use client'
import styles from "./page.module.css"
import {
  linkDialogPlugin,
  linkPlugin,
  MDXEditor,
  BoldItalicUnderlineToggles,
} from '@mdxeditor/editor'
// import React from 'react'
import { headingsPlugin, listsPlugin, quotePlugin, markdownShortcutPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

const Main_Editor = ({markdown, onChange}) => {
  return <MDXEditor
    markdown= {markdown}
    onChange={onChange}
    contentEditableClassName = {styles.editor}
    plugins={[
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      markdownShortcutPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
    ]}
    spellCheck={true}
    />
}

export default Main_Editor
