/**
 * Tiny event bus for opening the interactive 3D model viewer.
 * Any component can call openModel(); ModelViewer listens for the event.
 */
export const MODEL_EVENT = 'open-model'

export function openModel() {
  window.dispatchEvent(new Event(MODEL_EVENT))
}
