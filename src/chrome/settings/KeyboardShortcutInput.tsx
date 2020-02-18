/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  FlexColumn,
  styled,
  FlexRow,
  ToggleButton,
  Input,
  Text,
  colors,
} from 'flipper';
import React, {useRef, useState} from 'react';
import keycode from 'keycode';

const KEYCODES = {
  DELETE: 8,
  ALT: 18,
  SHIFT: 16,
  CTRL: 17,
  LEFT_COMMAND: 91, // Left ⌘ / Windows Key / Chromebook Search key
  RIGHT_COMMAND: 93, // Right ⌘ / Windows Menu
};

const Container = styled(FlexRow)({
  paddingLeft: 10,
  paddingRight: 10,
});

const Label = styled(Text)({
  paddingTop: 5,
});

const ShortcutKeysContainer = styled(FlexRow)({
  backgroundColor: colors.white,
  border: `1px solid ${colors.light15}`,
  borderRadius: 4,
  display: 'flex',
  justifyContent: 'center',
  height: 28,
  marginLeft: 10,
  flexGrow: 1,
  padding: 2,
});

const ShortcutKeyContainer = styled.div({
  border: `1px solid ${colors.light20}`,
  backgroundColor: colors.light05,
  padding: 3,
  margin: '0 1px',
  borderRadius: 3,
  width: 23,
  textAlign: 'center',
  boxShadow: `inset 0 -1px 0 ${colors.light20}`,
});

const ShortcutKey = styled.span({
  color: colors.dark70,
});

const HiddenInput = styled.input({
  opacity: 0,
  width: 0,
  height: 0,
});

const GreyedOutOverlay = styled.div({
  backgroundColor: '#EFEEEF',
  borderRadius: 4,
  opacity: 0.6,
  height: '100%',
  position: 'absolute',
  left: 0,
  right: 0,
});

const KeyboardShortcutInput = (props: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  // Whether to disallow interactions with this toggle
  frozen?: boolean;
}) => {
  // TODO: handle from props
  const [pressedKeys, setPressedKeys] = useState({
    metaKey: false,
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    character: '',
  });

  const inputRef = useRef(null);

  const handleFocusInput = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const isCharacterSpecial = (keycode: number) =>
    Object.values(KEYCODES).includes(keycode);

  const handleKeyDown = event => {
    if (event.which === 9) {
      return;
    }

    event.preventDefault();

    const {metaKey, altKey, ctrlKey, shiftKey} = event;

    setPressedKeys({
      metaKey,
      altKey,
      ctrlKey,
      shiftKey,
      character: isCharacterSpecial(event.which)
        ? ''
        : String.fromCharCode(event.which),
    });
  };

  const renderKeys = () => {
    const keys = [
      pressedKeys.metaKey && '⌘',
      pressedKeys.altKey && '⌥',
      pressedKeys.ctrlKey && '⌃',
      pressedKeys.shiftKey && '⇧',
      pressedKeys.character,
    ].filter(Boolean);

    return keys.map((key, index) => (
      <ShortcutKeyContainer key={index}>
        <ShortcutKey>{key}</ShortcutKey>
      </ShortcutKeyContainer>
    ));
  };

  return (
    <Container>
      <Label>{props.label}</Label>
      <ShortcutKeysContainer onClick={handleFocusInput}>
        {renderKeys()}

        <HiddenInput
          ref={inputRef}
          // onKeyUp={this.store}
          onKeyDown={handleKeyDown}
          // onBlur={this.handleBlur}
        />
      </ShortcutKeysContainer>
      {/* <IndentedSection>
      {props.children}
      {props.toggled || props.frozen ? null : <GreyedOutOverlay />}
    </IndentedSection> */}
    </Container>
  );
};

export default KeyboardShortcutInput;
