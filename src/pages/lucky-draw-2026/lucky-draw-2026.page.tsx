import React from 'react';
import { Typography, Stack, Box } from '@mui/material';
import backgroundOverlay from '../../assets/images/figma/background.png';
import maiBranch from '../../assets/images/figma/branch-left.png';
import daoBranch from '../../assets/images/figma/branch-right.png';
import logo from '../../assets/images/logo 1.png';
import { useLuckyDraw } from '../../context/lucky-draw.context';
import { useEffects } from '../../context/effects.context';
import { PrizeSelectorPart } from './parts/prize-selector.part';
import { DigitInputRowPart } from './parts/digit-input-row.part';
import {
  LUCKY_DRAW_2026_DESIGN_WIDTH,
  LUCKY_DRAW_2026_DESIGN_HEIGHT,
  LUCKY_DRAW_2026_ASPECT_RATIO,
  TRANSITION_TIMING,
  TYPOGRAPHY_STYLES,
  LAYOUT_STYLES,
} from './lucky-draw-2026.constants';
import { useBackgroundLoaded, useResponsiveScale, getViewMode, useViewModeTransition } from './lucky-draw-2026.hooks';
import { LuckyListUserPart } from './parts/lucky-list-user.part';
import { AwardeeListPart } from './parts/awardee-list.part';
import { AnimatedBackground, FlowerFrame } from './components/animated-background';
import { WinnerOverlay } from './parts/lucky-winner/WinnerOverlay';
import { prizes2026, employees } from '../../common/data';
import { Fireworks, PrizeId } from './components/animated-background/Fireworks';
import { StackRowAlignJustCenter } from '../../components/styles/stack.style';

const EmptyPlaceholder: React.FC<{ fontSize?: number }> = ({ fontSize = 24 }) => (
  <Box sx={LAYOUT_STYLES.emptyPlaceholder}>
    <Typography sx={{ ...TYPOGRAPHY_STYLES.emptyText, fontSize }}>Không có dữ liệu</Typography>
  </Box>
);

export const LuckyDraw2026Page: React.FC = () => {
  const { state: gameState } = useLuckyDraw();
  const { state: effectsState } = useEffects();

  const isBgLoaded = useBackgroundLoaded(backgroundOverlay);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const scale = useResponsiveScale(containerRef);

  const currentViewMode = getViewMode(gameState.announcement.visible, gameState.ceremony.displayMode);
  const isTransitioning = useViewModeTransition(currentViewMode);

  // Derived state
  const isWinnerVisible = currentViewMode === 'winner';
  const isCeremonyMode = currentViewMode === 'ceremony';
  const isDrawMode = currentViewMode === 'draw';
  const isSpecialPrizeWinner = gameState.announcement.winner?.prizeId === 'special';
  const isReplay = gameState.ceremony.isReplay;

  const consolationWinners = React.useMemo(() => {
    const list = gameState.ceremony.sessionAwardees;
    if (!list || list.length === 0) return [];

    // In replay mode, winners have 'awarded' status instead of 'pending_award'
    const statusToFilter = gameState.ceremony.isReplay ? 'awarded' : 'pending_award';

    return list
      .filter(w => w.prizeId === (gameState.currentPrizeId || w.prizeId) && w.status === statusToFilter)
      .map(w => {
        const originalEmployee = employees.find(e => e.code === w.employeeCode);
        return {
          code: w.employeeCode,
          name: w.employeeName,
          department: w.department || '',
          part: w.part || '',
          lotteryCode: originalEmployee?.lotteryCode || w.lotteryCode || '',
        };
      });
  }, [gameState.ceremony.sessionAwardees, gameState.currentPrizeId, gameState.ceremony.isReplay]);

  const shouldShowCandidateList = isDrawMode && gameState.digitRevealed.some(r => r === true);

  const prizeTitle = React.useMemo(() => {
    if (!isCeremonyMode) return 'QUAY SỐ TRÚNG THƯỞNG - YEP 2025';

    // In replay mode, use the replay data's prize name
    if (isReplay && gameState.ceremony.replayData) {
      return `CHÚC MỪNG SEVAGEN`;
    }

    const prizeId = gameState.ceremony.sessionAwardees?.[0]?.prizeId || gameState.currentPrizeId;
    const prize = prizes2026.find(p => p.id === prizeId);
    return prize ? `CHÚC MỪNG SEVAGEN` : 'CHÚC MỪNG SEVAGEN';
  }, [isCeremonyMode, isReplay, gameState.ceremony.replayData, gameState.ceremony.sessionAwardees, gameState.currentPrizeId]);

  // Main content visibility (draw & ceremony modes)
  const mainContentStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    pointerEvents: isTransitioning ? 'none' : 'auto',
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
    transition: isTransitioning
      ? `opacity ${TRANSITION_TIMING.FADE_OUT_CONTENT / 1000}s ease-in, transform ${TRANSITION_TIMING.FADE_OUT_CONTENT / 1000}s ease-in`
      : 'opacity 2s ease-out 1s, transform 2s ease-out 1s',
    backfaceVisibility: 'hidden',
  };

  return (
    <StackRowAlignJustCenter
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* Main content - always visible */}
      <StackRowAlignJustCenter
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          component="div"
          ref={containerRef}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: `min(100vw, calc(100vh * ${LUCKY_DRAW_2026_ASPECT_RATIO}))`,
            aspectRatio: `${LUCKY_DRAW_2026_ASPECT_RATIO}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <AnimatedBackground maiBranchSrc={maiBranch} daoBranchSrc={daoBranch} layoutScale={scale} />
          </Box>

          {/* Flower Frame - only show on winner overlay */}
          <FlowerFrame isVisible={isWinnerVisible} zIndex={100} />

          {/* Main background - fade in when loaded */}
          <Box
            component="img"
            src={backgroundOverlay}
            alt="backgroundOverlay"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              zIndex: 0,
              pointerEvents: 'none',
              opacity: isBgLoaded ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          />

          {/* Fireworks */}
          <Fireworks
            prizeId={
              (effectsState.fireworksPrizeId || gameState.announcement.winner?.prizeId || gameState.ceremony.sessionAwardees?.[0]?.prizeId) as
                | PrizeId
                | undefined
            }
            isActive={
              effectsState.fireworksTriggerId > 0 || gameState.ceremony.displayMode === 'ceremony' || (isWinnerVisible && !isSpecialPrizeWinner)
            }
            triggerId={effectsState.fireworksTriggerId}
            zIndex={2}
          />

          {/* Interactive content layer - Draw & Ceremony modes */}
          <Box sx={mainContentStyle}>
            <StackRowAlignJustCenter
              sx={{
                width: LUCKY_DRAW_2026_DESIGN_WIDTH,
                height: LUCKY_DRAW_2026_DESIGN_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}
              >
                {/* Logo - visible only on ceremony mode */}
                {isCeremonyMode && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 24,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 20,
                      marginBottom: '32px',
                    }}
                  >
                    <Box
                      component="img"
                      src={logo}
                      alt="Logo"
                      sx={{
                        width: 180,
                        height: 'auto',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                )}

                {/* 2 column layout */}
                {!isWinnerVisible && (
                  <Stack
                    direction="row"
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: 50,
                      transform: 'translateX(-50%)',
                      gap: '24px',
                      width: LUCKY_DRAW_2026_DESIGN_WIDTH - 200,
                      height: LUCKY_DRAW_2026_DESIGN_HEIGHT - 100,
                      padding: '0 20px',
                    }}
                  >
                    {/* Left Column - Main Draw */}
                    <Stack
                      sx={{
                        flex: 3,
                        alignItems: 'center',
                        gap: '56px',
                        padding: isCeremonyMode ? '180px 40px 40px 40px' : '80px 60px 40px 60px',
                        background: isCeremonyMode ? 'transparent' : 'rgba(6, 62, 56, 0.24)',
                        backdropFilter: isCeremonyMode ? 'none' : 'blur(20px)',
                        borderRadius: '32px',
                        height: '100%',
                      }}
                    >
                      <Typography sx={TYPOGRAPHY_STYLES.pageTitle}>{prizeTitle}</Typography>

                      {/* Ceremony Mode: Show awardee list */}
                      {isCeremonyMode && (
                        <AwardeeListPart awardees={gameState.ceremony.sessionAwardees} showRemoveButton={false} isReplay={isReplay} />
                      )}

                      {/* Draw Mode: Show digit input and candidate list */}
                      {isDrawMode && (
                        <>
                          <Stack sx={{ alignItems: 'center', gap: 6 }}>
                            <PrizeSelectorPart selectedPrizeId={gameState.currentPrizeId || undefined} />
                            <DigitInputRowPart
                              digits={gameState.digits}
                              nextPosition={null}
                              onDigitEnter={() => {}}
                              onUndo={() => {}}
                              disabled={true}
                              digitRevealed={gameState.digitRevealed}
                            />
                          </Stack>

                          <Stack
                            sx={{
                              gap: '56px',
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Typography sx={TYPOGRAPHY_STYLES.sectionTitle}>
                              {gameState.remainingCandidates.length === 1
                                ? 'Đã tìm thấy người trúng thưởng'
                                : `Danh sách cơ hội trúng thưởng ${gameState.remainingCandidates.length && shouldShowCandidateList ? `(${gameState.remainingCandidates.length})` : ''}`}
                            </Typography>
                            {gameState.remainingCandidates.length > 0 && shouldShowCandidateList ? (
                              <LuckyListUserPart remainingCandidates={gameState.remainingCandidates} />
                            ) : (
                              <EmptyPlaceholder />
                            )}
                          </Stack>
                        </>
                      )}
                    </Stack>

                    {/* Right Column - Consolation Results*/}
                    {isDrawMode && (
                      <Stack
                        sx={{
                          flex: 1,
                          alignItems: 'center',
                          gap: '48px',
                          padding: '80px 40px 40px 40px',
                          background: 'rgba(6, 62, 56, 0.24)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '32px',
                          height: '100%',
                        }}
                      >
                        <Typography sx={{ ...TYPOGRAPHY_STYLES.sectionTitle, textShadow: '0px 0px 2px rgba(255,255,255,0.8)' }}>
                          KẾT QUẢ TRÚNG THƯỞNG <br /> {prizes2026.find(p => p.id === gameState.currentPrizeId)?.name}
                          {consolationWinners.length > 0 && ` (${consolationWinners?.length})`}
                        </Typography>
                        {consolationWinners.length > 0 ? (
                          <LuckyListUserPart remainingCandidates={consolationWinners} showAsResults />
                        ) : (
                          <EmptyPlaceholder fontSize={20} />
                        )}
                      </Stack>
                    )}
                  </Stack>
                )}
              </Box>
            </StackRowAlignJustCenter>
          </Box>

          {/* WINNER OVERLAY */}
          <WinnerOverlay winner={gameState.announcement.winner} isVisible={isWinnerVisible} scale={scale} />
        </Box>
      </StackRowAlignJustCenter>
    </StackRowAlignJustCenter>
  );
};

export default LuckyDraw2026Page;
