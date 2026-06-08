import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../AppContext';
import { BrothType, TextureType, NoodleThicknessType, RichnessType, SpiceType } from '../types';
import { toast } from 'sonner';
import { CloseIcon, NavIconButton } from '../components/NavIconButton';
import { AppButton } from '../components/AppButton';

const BROTH_OPTIONS: { id: BrothType; label: string; desc: string; category: string }[] = [
  { id: '돼지', label: '돈코츠', desc: '진하고 크리미한 돼지뼈 육수', category: '육수' },
  { id: '닭', label: '토리파이탄', desc: '부드럽고 깊은 닭 육수', category: '육수' },
  { id: '해물', label: '해물', desc: '감칠맛이 선명한 바다 육수', category: '육수' },
  { id: '쇼유', label: '쇼유', desc: '간장의 깊고 깔끔한 향', category: '타레' },
  { id: '시오', label: '시오', desc: '맑고 담백한 소금 간', category: '타레' },
  { id: '미소', label: '미소', desc: '고소하고 묵직한 된장 풍미', category: '타레' },
];

const NOODLE_THICKNESS_OPTIONS: { id: NoodleThicknessType; label: string; desc: string }[] = [
  { id: '가는 면', label: '가는 면', desc: '육수를 빠르게 머금는 섬세한 면' },
  { id: '보통 면', label: '보통 면', desc: '어떤 국물과도 균형 잡힌 면' },
  { id: '굵은 면', label: '굵은 면', desc: '씹는 맛이 뚜렷하고 존재감 있는 면' },
];

const TEXTURE_OPTIONS: { id: TextureType; label: string; desc: string }[] = [
  { id: '꼬들', label: '꼬들', desc: '단단한 심이 느껴지는 식감' },
  { id: '보통', label: '보통', desc: '부드러움과 탄력의 균형' },
  { id: '퍼짐', label: '부드럽게', desc: '말랑하고 편안하게 넘어가는 면' },
];

const RICHNESS_OPTIONS: { id: RichnessType; label: string; desc: string }[] = [
  { id: '진함', label: '진한 국물', desc: '입안에 오래 남는 깊은 농도' },
  { id: '보통', label: '균형 있는 국물', desc: '부담 없이 충분한 감칠맛' },
  { id: '맑음', label: '맑은 국물', desc: '깔끔하고 산뜻한 마무리' },
];

const SPICE_OPTIONS: { id: SpiceType; label: string; desc: string }[] = [
  { id: '없음', label: '맵지 않게', desc: '국물 본연의 맛에 집중' },
  { id: '약간', label: '살짝 매콤하게', desc: '은근한 자극이 있는 정도' },
  { id: '보통', label: '적당히 맵게', desc: '땀이 조금 나는 즐거운 매움' },
  { id: '강함', label: '아주 맵게', desc: '강한 매운맛을 즐기는 편' },
];

const STEPS = [
  { label: '육수', question: '어떤 국물 스타일이\n가장 당기나요?', guide: '오늘 가장 먹고 싶은 한 가지를 골라주세요.' },
  { label: '면 굵기', question: '어떤 굵기의 면을\n좋아하나요?', guide: '국물과 함께 씹을 때 좋은 면을 떠올려보세요.' },
  { label: '면 식감', question: '면은 어느 정도로\n익힌 게 좋나요?', guide: '입안에서 느껴지는 탄력 기준으로 골라주세요.' },
  { label: '국물 농도', question: '국물의 농도는\n어느 쪽인가요?', guide: '끝까지 마시고 싶은 국물 느낌을 선택하세요.' },
  { label: '맵기', question: '매운맛은 얼마나\n필요한가요?', guide: '마지막 질문입니다. 바로 맞춤 지도로 이어집니다.' },
] as const;

type CardProps = {
  label: string;
  desc: string;
  active: boolean;
  onClick: () => void;
  accent: string;
  chipBg: string;
  border: string;
  titleColor: string;
  subColor: string;
};

function ChoiceCard({ label, desc, active, onClick, accent, chipBg, border, titleColor, subColor }: CardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-[12px] px-[14px] py-[13px] rounded-[12px] text-left transition-all duration-200 active:scale-[0.98]"
      style={{
        backgroundColor: active ? `${accent}16` : chipBg,
        border: `1.5px solid ${active ? accent : border}`,
      }}
    >
      <div className="min-w-0">
        <div style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '14px', fontWeight: active ? 700 : 500, color: active ? accent : titleColor }}>
          {label}
        </div>
        <div className="mt-[3px]" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '11px', color: subColor }}>
          {desc}
        </div>
      </div>
      <div
        className="size-[20px] rounded-full shrink-0 flex items-center justify-center"
        style={{ border: `1.5px solid ${active ? accent : border}` }}
      >
        {active && <div className="size-[10px] rounded-full" style={{ backgroundColor: accent }} />}
      </div>
    </button>
  );
}

export default function PreferenceSelectionPage() {
  const navigate = useNavigate();
  const { preference, setPreference, theme } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBroths, setSelectedBroths] = useState<BrothType[]>(preference.broth.slice(0, 1));
  const [selectedNoodleThickness, setSelectedNoodleThickness] = useState<NoodleThicknessType | null>(preference.noodleThickness);
  const [selectedTexture, setSelectedTexture] = useState<TextureType | null>(preference.texture);
  const [selectedRichness, setSelectedRichness] = useState<RichnessType | null>(preference.richness);
  const [selectedSpice, setSelectedSpice] = useState<SpiceType | null>(preference.spiceLevel);

  const answers = [
    selectedBroths.length > 0,
    selectedNoodleThickness !== null,
    selectedTexture !== null,
    selectedRichness !== null,
    selectedSpice !== null,
  ];
  const currentAnswered = answers[currentStep];
  const allAnswered = answers.every(Boolean);
  const step = STEPS[currentStep];

  const handleNext = () => {
    if (currentAnswered && currentStep < STEPS.length - 1) {
      setCurrentStep((previous) => previous + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
    }
  };

  const handleFind = () => {
    if (!allAnswered) {
      toast.error('모든 질문에 답하면 내 라멘을 찾을 수 있어요', { duration: 2200 });
      return;
    }
    setPreference({
      broth: selectedBroths,
      noodleThickness: selectedNoodleThickness,
      texture: selectedTexture,
      richness: selectedRichness,
      spiceLevel: selectedSpice,
    });
    navigate('/map');
  };

  const {
    pageBg, chipBg, deepBg, accent, accentSoft, titleColor,
    subColor, mutedColor, labelColor, border, accentGlow,
  } = theme;

  return (
    <div className="min-h-full w-full px-[20px] pt-[10px] pb-[24px] flex flex-col transition-colors duration-500" style={{ backgroundColor: pageBg }}>
      <header className="h-[48px] flex items-center justify-between mb-[8px]" aria-label="취향 설문 상단 네비게이션">
        <NavIconButton onClick={() => navigate('/')} ariaLabel="취향 찾기 나가기" size="sm">
          <CloseIcon />
        </NavIconButton>
        <span style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', fontWeight: 700, color: mutedColor }}>
          {currentStep + 1} / {STEPS.length}
        </span>
        <div className="size-[44px]" aria-hidden="true" />
      </header>
      <h1
        className="tracking-[-1.3px]"
        style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '27px', lineHeight: 1.22, fontWeight: 900, color: titleColor }}
      >
        당신의 라멘 취향을<br />찾아볼게요
      </h1>
      <p className="mt-[8px]" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: mutedColor }}>
        5가지 질문으로 로컬 라멘집을 추천해드립니다.
      </p>

      <div className="flex gap-[5px] mt-[24px]" aria-label={`${currentStep + 1} / ${STEPS.length} 단계`}>
        {STEPS.map((surveyStep, index) => (
          <div key={surveyStep.label} className="flex-1">
            <div
              className="h-[4px] rounded-full"
              style={{ backgroundColor: index <= currentStep ? accent : border }}
            />
            <span
              className="block mt-[6px] text-center"
              style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '10px', color: index === currentStep ? accent : mutedColor, fontWeight: index === currentStep ? 700 : 400 }}
            >
              {surveyStep.label}
            </span>
          </div>
        ))}
      </div>

      <section
        className="mt-[22px] rounded-[18px] p-[18px] flex flex-col"
        style={{ backgroundColor: deepBg, border: `1px solid ${border}` }}
      >
        <div className="flex items-center justify-between mb-[12px]">
          <span aria-hidden="true" />
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', color: mutedColor }}>
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>
        <h2
          className="whitespace-pre-line tracking-[-0.5px]"
          style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '21px', lineHeight: 1.32, fontWeight: 900, color: titleColor }}
        >
          {step.question}
        </h2>
        <p className="mt-[7px] mb-[17px]" style={{ fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '12px', color: mutedColor }}>
          {step.guide}
        </p>

        <div className="flex flex-col gap-[8px]">
          {currentStep === 0 && BROTH_OPTIONS.map((option) => (
            <div key={option.id} className="relative">
              <ChoiceCard
                label={option.label}
                desc={option.desc}
                active={selectedBroths.includes(option.id)}
                onClick={() => setSelectedBroths([option.id])}
                accent={accent}
                chipBg={chipBg}
                border={border}
                titleColor={titleColor}
                subColor={subColor}
              />
              <span
                className="absolute top-[11px] right-[42px] px-[6px] py-[2px] rounded-full"
                style={{ backgroundColor: pageBg, fontFamily: "'WenQuanYi Zen Hei', sans-serif", fontSize: '9px', color: mutedColor }}
              >
                {option.category}
              </span>
            </div>
          ))}
          {currentStep === 1 && NOODLE_THICKNESS_OPTIONS.map((option) => (
            <ChoiceCard key={option.id} label={option.label} desc={option.desc} active={selectedNoodleThickness === option.id} onClick={() => setSelectedNoodleThickness(option.id)} accent={accent} chipBg={chipBg} border={border} titleColor={titleColor} subColor={subColor} />
          ))}
          {currentStep === 2 && TEXTURE_OPTIONS.map((option) => (
            <ChoiceCard key={option.id} label={option.label} desc={option.desc} active={selectedTexture === option.id} onClick={() => setSelectedTexture(option.id)} accent={accent} chipBg={chipBg} border={border} titleColor={titleColor} subColor={subColor} />
          ))}
          {currentStep === 3 && RICHNESS_OPTIONS.map((option) => (
            <ChoiceCard key={option.id} label={option.label} desc={option.desc} active={selectedRichness === option.id} onClick={() => setSelectedRichness(option.id)} accent={accent} chipBg={chipBg} border={border} titleColor={titleColor} subColor={subColor} />
          ))}
          {currentStep === 4 && SPICE_OPTIONS.map((option) => (
            <ChoiceCard key={option.id} label={option.label} desc={option.desc} active={selectedSpice === option.id} onClick={() => setSelectedSpice(option.id)} accent={accent} chipBg={chipBg} border={border} titleColor={titleColor} subColor={subColor} />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-[10px] mt-auto pt-[20px]">
        {currentStep > 0 && (
          <AppButton
            onClick={handlePrevious}
            variant="secondary"
            size="lg"
            fullWidth
          >
            이전
          </AppButton>
        )}
        {currentStep < STEPS.length - 1 ? (
          <AppButton
            onClick={handleNext}
            disabled={!currentAnswered}
            variant="primary"
            size="lg"
            fullWidth
          >
            다음
          </AppButton>
        ) : (
          <AppButton
            onClick={handleFind}
            disabled={!allAnswered}
            variant="primary"
            size="lg"
            fullWidth
          >
            내 라멘 찾기
          </AppButton>
        )}
      </div>
    </div>
  );
}
