'use strict'
import { v4 as uuid } from 'uuid'
import { CancellationToken, Disposable, DocumentSelector, Position, Range, WorkspaceEdit } from 'vscode-languageserver-protocol'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { RenameProvider } from './index'
import Manager from './manager'

export default class RenameManager extends Manager<RenameProvider> {

  public register(selector: DocumentSelector, provider: RenameProvider): Disposable {
    return this.addProvider({
      id: uuid(),
      selector,
      provider
    })
  }

  public async provideRenameEdits(
    document: TextDocument,
    position: Position,
    newName: string,
    token: CancellationToken
  ): Promise<WorkspaceEdit | null> {
    let item = this.getProvider(document)
    if (!item) return null
    let { provider } = item
    return await Promise.resolve(provider.provideRenameEdits(document, position, newName, token))
  }

  public async prepareRename(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): Promise<Range | { range: Range; placeholder: string } | false> {
    let item = this.getProvider(document)
    if (!item) return null
    let { provider } = item
    if (provider.prepareRename == null) return null
    let res = await Promise.resolve(provider.prepareRename(document, position, token))
    // can not rename
    if (res == null) return false
    return res
  }
}
