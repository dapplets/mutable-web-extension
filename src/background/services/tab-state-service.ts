type TabId = number

type TabState = {
  mutationId: string | null
}

export class TabStateService {
  private _state = new Map<TabId, TabState>()

  push(tabId: TabId, state: TabState) {
    this._state.set(tabId, state)
  }

  pop(tabId: TabId): TabState | null {
    const state = this._state.get(tabId)
    this._state.delete(tabId)
    return state
  }
}
