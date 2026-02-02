import { Stack, styled } from '@mui/material';
import { STYLE } from '../../common/constant';

export const StackRow = styled(Stack)(() => ({
  flexDirection: 'row',
}));

export const StackWrap = styled(Stack)(() => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

export const StackRowAlignCenter = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

export const StackRowAlignEnd = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'flex-end',
}));

export const StackRowJustCenter = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'center',
}));

export const StackRowAlignJustCenter = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StackRowAlignCenterJustEnd = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

export const StackRowJustEnd = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
}));

export const StackRowJustBetween = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

export const StackRowAlignCenterJustBetween = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const StackBgDefaultBorRadLayCol = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: STYLE.PADDING_GAP_LAYOUT,
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
}));

export const StackBgPaperBorRadLayCol = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: STYLE.PADDING_GAP_LAYOUT,
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
}));

export const StackLabel = styled(Stack)(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: STYLE.PADDING_GAP_ITEM_SMALL,
  gap: STYLE.PADDING_GAP_ITEM_SMALL,
}));
