import { DocumentPage } from '../components/DocumentPage'
import { EditorView } from '../components/EditorView'
import { PageSidebar } from '../components/PageSidebar'
import styles from './EditorPage.module.css'

export function EditorPage() {
  return (
    <div className={styles.editor}>
      <EditorView>
        <DocumentPage />
      </EditorView>
      <PageSidebar className={styles.sidebar} />
    </div>
  )
}
