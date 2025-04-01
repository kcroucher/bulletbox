import { Board } from './types';
import { noteToPromotion, noteToSquare } from './mappings';

let board: Board;
function setupBoard(access: MIDIAccess, boardElement: Element) {
    const hoverSquare = boardElement.querySelector('.hover-square');
    if (!hoverSquare) return;

    const bound = hoverSquare.getBoundingClientRect();
    if (!bound) return;

    board = new Board(boardElement, bound);

    access.inputs.forEach(input => {
        input.onmidimessage = (message) => {
            if (!message.data) return;
    
            const cmd = message.data[0];
            const note = message.data[1];
            const velocity = message.data[2];
            if (cmd === 144) {
                const square = noteToSquare(note);
                if (velocity === 0 || !square) return;
    
                board.select(square);
            } else if (cmd === 176) {
                const piece = noteToPromotion(note);
                if (!piece) return;
                    
                board.promote(piece);
            }
        };
    });
}

function onMIDISuccess(access: MIDIAccess) {
    const boardElement = document.querySelector('wc-chess-board');
    if (boardElement) {
        setupBoard(access, boardElement);
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === "WC-CHESS-BOARD") {
                        setupBoard(access, node as Element);
                        obs.disconnect();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

function onMIDIFailure() {
    console.error("Failed to get MIDI access");
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
