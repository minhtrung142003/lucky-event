import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Stack, useTheme } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import { STYLE } from '../../../common/constant';
import { ButtonElement, ButtonElementProps } from '../button/button.element';
import { useSelector } from 'react-redux';
import { Mode } from '../../../common/enums/mode.enum';
import { GlobalReduxState } from '../../../redux/store.interface';
import { IconContentElement } from '../icon/icon-content.element';
import { StackRowAlignCenterJustBetween, StackRow } from '../../styles/stack.style';

export interface DialogElementProps extends DialogProps {
  iconLabel?: string;
  label: string;
  nodeLabel?: ReactNode;
  nodeHelp?: ReactNode;
  buttonRight?: ButtonElementProps;
  buttonLeft?: ButtonElementProps;
  direction?: 'column' | 'row';
  nodeContent?: ReactNode;
}

export const DialogElement: React.FC<DialogElementProps> = ({
  iconLabel = 'leaderboard',
  label,
  nodeLabel,
  nodeHelp,
  buttonRight,
  buttonLeft,
  direction = 'column',
  nodeContent,
  sx,
  ...rest
}) => {
  const { palette } = useTheme();

  const mode = useSelector((state: GlobalReduxState) => state.system.mode);

  const [openHelp, setOpenHelp] = useState(false);

  return (
    <Dialog
      {...rest}
      PaperProps={{ sx: { borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER, ...sx } }}
      BackdropProps={{
        sx: { backgroundColor: mode === Mode.DARK ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)' },
      }}
    >
      <DialogTitle
        component={'div'}
        sx={{
          display: 'flex',
          padding: `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)`,
          paddingBottom: STYLE.PADDING_GAP_LAYOUT,
          gap: STYLE.PADDING_GAP_ITEM_SMALL,
          backgroundColor: palette.background.paper,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {label && <IconContentElement icon={iconLabel} content={label} size="medium" />}
        {nodeLabel}
      </DialogTitle>

      <React.Fragment>
        <DialogContent
          sx={{
            padding: 0,
            paddingBottom: !buttonLeft && !buttonRight ? `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)` : 0,
            px: `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)`,
            backgroundColor: palette.background.paper,
            maxHeight: '65vh',
          }}
        >
          {nodeContent}
        </DialogContent>

        {(buttonLeft || buttonRight) && (
          <DialogActions
            sx={{
              padding: `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)`,
              paddingTop: STYLE.PADDING_GAP_LAYOUT,
              backgroundColor: palette.background.paper,
              // '& > :not(style) ~ :not(style)': { marginLeft: STYLE.PADDING_GAP_LAYOUT },
            }}
          >
            <Stack sx={{ flex: 1 }}>
              <StackRowAlignCenterJustBetween>
                {nodeHelp && (
                  <IconContentElement
                    icon={openHelp ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
                    content="Need help"
                    size="medium"
                    onClick={() => setOpenHelp(!openHelp)}
                    sx={{ flexDirection: 'row-reverse' }}
                  />
                )}

                <StackRow sx={{ flex: 1, justifyContent: 'flex-end' }}>
                  {buttonLeft && <ButtonElement {...buttonLeft} fullWidth={false} />}

                  {buttonRight && <ButtonElement {...buttonRight} fullWidth={false} />}
                </StackRow>
              </StackRowAlignCenterJustBetween>
            </Stack>
          </DialogActions>
        )}
      </React.Fragment>
      {openHelp && (
        <Stack
          sx={{
            maxHeight: 200,
            padding: `calc(${STYLE.PADDING_GAP_LAYOUT} * 1.5)`,
            paddingTop: 0,
            overflowY: 'auto',
          }}
        >
          {nodeHelp}
        </Stack>
      )}
    </Dialog>
  );
};
