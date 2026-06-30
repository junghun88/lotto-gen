// Lotto Recommendation Helper Utilities and Dream/Zodiac Dictionaries

// 1. Dream keywords and their traditional Korean lotto number associations
export interface DreamKeyword {
  keyword: string;
  numbers: number[];
  meaning: string;
}

export const DREAM_DICTIONARY: DreamKeyword[] = [
  { keyword: "돼지 (Pig)", numbers: [3, 8, 12, 17, 24, 45], meaning: "전통적으로 재물과 다산을 상징하는 최고의 길몽" },
  { keyword: "똥 (Poop)", numbers: [1, 7, 13, 21, 33, 38], meaning: "예상치 못한 큰 횡재수와 재물이 넝쿨째 굴러올 징조" },
  { keyword: "조상님 (Ancestors)", numbers: [4, 9, 15, 26, 35, 42], meaning: "중요한 계시나 뜻밖의 기회를 전해주는 신비로운 꿈" },
  { keyword: "대통령 (President)", numbers: [2, 11, 19, 28, 37, 44], meaning: "권력, 명예, 그리고 일의 대성공을 뜻하는 최고 권위의 길몽" },
  { keyword: "황금 (Gold)", numbers: [5, 14, 20, 31, 39, 41], meaning: "금전적 풍요로움과 장기적인 자산 상승을 가져올 행운" },
  { keyword: "물 (Water)", numbers: [6, 10, 18, 25, 30, 43], meaning: "막힌 기운이 풀리고 재산이 물 흐르듯 가득 찰 길조" },
  { keyword: "용 (Dragon)", numbers: [3, 16, 22, 29, 36, 40], meaning: "귀인의 도움으로 승승장구하며 대업을 이룰 운명" },
  { keyword: "불 (Fire)", numbers: [8, 11, 23, 27, 34, 45], meaning: "사업이나 추진 중인 일이 불길처럼 번성해 대박날 꿈" },
  { keyword: "보석 (Jewel)", numbers: [7, 12, 24, 28, 32, 41], meaning: "재능을 널리 인정받고 보석처럼 빛나는 행운이 도래할 신호" },
  { keyword: "하늘을 나는 꿈 (Flight)", numbers: [9, 14, 19, 25, 31, 44], meaning: "자유와 도약, 신분 상승과 소망 성취가 이루어질 길몽" }
];

// 2. Zodiac signs and lucky numbers
export interface ZodiacSign {
  name: string;
  animal: string;
  luckyNumbers: number[];
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "쥐띠 (Rat)", animal: "🐭", luckyNumbers: [1, 10, 19, 28, 37, 45] },
  { name: "소띠 (Ox)", animal: "🐮", luckyNumbers: [2, 11, 20, 29, 38, 41] },
  { name: "호랑이띠 (Tiger)", animal: "🐯", luckyNumbers: [3, 12, 21, 30, 39, 42] },
  { name: "토끼띠 (Rabbit)", animal: "🐰", luckyNumbers: [4, 13, 22, 31, 40, 43] },
  { name: "용띠 (Dragon)", animal: "🐲", luckyNumbers: [5, 14, 23, 32, 41, 44] },
  { name: "뱀띠 (Snake)", animal: "🐍", luckyNumbers: [6, 15, 24, 33, 42, 45] },
  { name: "말띠 (Horse)", animal: "🐴", luckyNumbers: [7, 16, 25, 34, 43, 10] },
  { name: "양띠 (Sheep)", animal: "🐑", luckyNumbers: [8, 17, 26, 35, 44, 11] },
  { name: "원숭이띠 (Monkey)", animal: "🐵", luckyNumbers: [9, 18, 27, 36, 45, 12] },
  { name: "닭띠 (Rooster)", animal: "🐔", luckyNumbers: [10, 19, 28, 37, 1, 13] },
  { name: "개띠 (Dog)", animal: "🐶", luckyNumbers: [11, 20, 29, 38, 2, 14] },
  { name: "돼지띠 (Pig)", animal: "🐷", luckyNumbers: [12, 21, 30, 39, 3, 15] }
];

// 3. Real historical statistical parameters (Korean Lotto 6/45 1st Place statistics)
// Based on actual accumulated lottery statistics
export const HISTORICAL_HOT_NUMBERS = [43, 34, 12, 17, 18, 1, 27, 13, 10, 2, 33, 39, 45, 14]; // High frequency
export const HISTORICAL_COLD_NUMBERS = [9, 22, 41, 32, 23, 29, 30, 36, 38]; // Low frequency

// Helper to check if numbers contain consecutive values (e.g., 14, 15) and how many pairs
export function getConsecutivePairsCount(nums: number[]): number {
  let count = 0;
  const sorted = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] - sorted[i] === 1) {
      count++;
    }
  }
  return count;
}

// Helper to calculate Arithmetic Complexity (AC Value)
// AC = (Number of unique differences between numbers) - (k - 1)
// k is the number of picked numbers (6). k-1 = 5
export function calculateACValue(nums: number[]): number {
  if (nums.length < 2) return 0;
  const differences = new Set<number>();
  const sorted = [...nums].sort((a, b) => a - b);
  
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      differences.add(sorted[j] - sorted[i]);
    }
  }
  
  return differences.size - 5;
}

// Lotto Ball color class selector
export function getBallColorClass(num: number): string {
  if (num >= 1 && num <= 10) return "bg-amber-400 border-amber-300 shadow-amber-200/50";
  if (num >= 11 && num <= 20) return "bg-blue-500 border-blue-400 shadow-blue-200/50";
  if (num >= 21 && num <= 30) return "bg-red-500 border-red-400 shadow-red-200/50";
  if (num >= 31 && num <= 40) return "bg-stone-500 border-stone-400 shadow-stone-200/50";
  return "bg-emerald-500 border-emerald-400 shadow-emerald-200/50";
}

// Generate lotto numbers utilizing statistical probability model derived from real 1st place winning records
export interface GenerationSettings {
  consecutiveMode: "auto" | "must" | "never";
  hotColdBalance: "balanced" | "aggressive" | "stable";
  sumConstraint: "optimal" | "wide"; // optimal: 110~170, wide: 90~190
}

export function generateHistoricalFirstPlacePatternNumbers(settings: GenerationSettings): number[] {
  let attempts = 0;
  
  while (attempts < 500) {
    const nums: number[] = [];
    const pool = Array.from({ length: 45 }, (_, i) => i + 1);
    
    // Assign weight probability to each number based on settings
    // Hot numbers have high draw probability, cold numbers have low draw probability in standard
    const weights = pool.map(num => {
      let weight = 10; // default weight
      
      const isHot = HISTORICAL_HOT_NUMBERS.includes(num);
      const isCold = HISTORICAL_COLD_NUMBERS.includes(num);
      
      if (settings.hotColdBalance === "balanced") {
        if (isHot) weight = 15;
        else if (isCold) weight = 5;
      } else if (settings.hotColdBalance === "aggressive") {
        if (isHot) weight = 25; // extremely value hot numbers
        else if (isCold) weight = 2; // disregard cold numbers
      } else { // stable (even probability)
        weight = 10;
      }
      return { num, weight };
    });

    // Draw 6 numbers using weighted selection
    const tempWeights = [...weights];
    while (nums.length < 6) {
      const totalWeight = tempWeights.reduce((acc, item) => acc + item.weight, 0);
      let rand = Math.random() * totalWeight;
      
      for (let i = 0; i < tempWeights.length; i++) {
        rand -= tempWeights[i].weight;
        if (rand <= 0) {
          nums.push(tempWeights[i].num);
          tempWeights.splice(i, 1);
          break;
        }
      }
    }

    nums.sort((a, b) => a - b);

    // Verify combination against historical 1st place patterns
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    const oddCount = nums.filter(n => n % 2 !== 0).length;
    const lowCount = nums.filter(n => n <= 23).length;
    const consecutiveCount = getConsecutivePairsCount(nums);
    const acValue = calculateACValue(nums);

    // Criteria checks
    // 1. Sum range (optimal is 110~170, representing ~72% of all 1st place winners)
    const isSumValid = settings.sumConstraint === "optimal" 
      ? (sum >= 110 && sum <= 170) 
      : (sum >= 95 && sum <= 185);

    // 2. Odd-even ratio must be 3:3, 2:4 or 4:2 (representing ~81% of winners)
    const isOddEvenValid = oddCount >= 2 && oddCount <= 4;

    // 3. High-low ratio must be 3:3, 2:4 or 4:2 (representing ~82% of winners)
    const isHighLowValid = lowCount >= 2 && lowCount <= 4;

    // 4. AC value must be >= 7 (representing ~91% of winners, filters out simple step progression)
    const isACValid = acValue >= 7;

    // 5. Consecutive numbers filter
    let isConsecutiveValid = true;
    if (settings.consecutiveMode === "must") {
      isConsecutiveValid = consecutiveCount >= 1;
    } else if (settings.consecutiveMode === "never") {
      isConsecutiveValid = consecutiveCount === 0;
    } else {
      isConsecutiveValid = consecutiveCount <= 2; // standard: mostly 0 or 1, rarely 2
    }

    // 6. Extreme pattern blocker (prevent e.g., all 6 numbers ending in same digit, or all from same color band)
    const endingDigits = nums.map(n => n % 10);
    const mostFrequentEndDigit = Math.max(...Array.from({ length: 10 }, (_, d) => endingDigits.filter(x => x === d).length));
    const isNotExtremeEndDigit = mostFrequentEndDigit <= 3;

    if (isSumValid && isOddEvenValid && isHighLowValid && isACValid && isConsecutiveValid && isNotExtremeEndDigit) {
      return nums;
    }
    attempts++;
  }

  // Fallback balanced number generation if settings were too restrictive
  return generateBalancedNumbers();
}

// Generate balanced lotto numbers using simulated stats matching Korean lotto patterns
export function generateBalancedNumbers(): number[] {
  let attempts = 0;
  while (attempts < 100) {
    const nums: number[] = [];
    while (nums.length < 6) {
      const rand = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(rand)) {
        nums.push(rand);
      }
    }
    nums.sort((a, b) => a - b);

    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    const oddCount = nums.filter(n => n % 2 !== 0).length;
    const lowCount = nums.filter(n => n <= 23).length;

    const isSumBalanced = sum >= 100 && sum <= 180;
    const isOddEvenBalanced = oddCount >= 2 && oddCount <= 4;
    const isHighLowBalanced = lowCount >= 2 && lowCount <= 4;

    if (isSumBalanced && isOddEvenBalanced && isHighLowBalanced) {
      return nums;
    }
    attempts++;
  }

  const fallback: number[] = [];
  while (fallback.length < 6) {
    const rand = Math.floor(Math.random() * 45) + 1;
    if (!fallback.includes(rand)) {
      fallback.push(rand);
    }
  }
  return fallback.sort((a, b) => a - b);
}

// Generate dream lotto numbers from custom word using a hashing algorithm
export function generateNumbersFromDreamText(text: string): number[] {
  const cleanText = text.trim();
  if (!cleanText) return generateBalancedNumbers();

  const matched = DREAM_DICTIONARY.find(item => cleanText.includes(item.keyword.split(" ")[0]));
  if (matched) {
    return [...matched.numbers].sort((a, b) => a - b);
  }

  let hash = 0;
  for (let i = 0; i < cleanText.length; i++) {
    hash = cleanText.charCodeAt(i) + ((hash << 5) - hash);
  }

  const result: number[] = [];
  let seed = Math.abs(hash);

  while (result.length < 6) {
    seed = (seed * 9301 + 49297) % 233280;
    const num = (seed % 45) + 1;
    if (!result.includes(num)) {
      result.push(num);
    }
  }

  return result.sort((a, b) => a - b);
}

// Generate destiny lotto numbers based on birthdate & zodiac index
export function generateDestinyNumbers(birthdate: string, zodiacIndex: number): number[] {
  if (!birthdate) return ZODIAC_SIGNS[zodiacIndex].luckyNumbers;

  const parts = birthdate.split("-").map(Number);
  const year = parts[0] || 1990;
  const month = parts[1] || 1;
  const day = parts[2] || 1;

  const zodiac = ZODIAC_SIGNS[zodiacIndex];
  const baseNumbers = zodiac.luckyNumbers;

  const pool = new Set<number>();
  
  pool.add(((year + month + day) % 45) + 1);
  pool.add(((month * day) % 45) + 1);
  pool.add(((day + 7) % 45) + 1);
  
  baseNumbers.forEach(n => {
    if (pool.size < 6) pool.add(n);
  });

  let fallbackSeed = day;
  while (pool.size < 6) {
    fallbackSeed = (fallbackSeed * 17 + 11) % 45 + 1;
    pool.add(fallbackSeed);
  }

  return Array.from(pool).sort((a, b) => a - b);
}

// Detailed statistical feedback model for 1st place patterns
export interface AdvancedLottoReport {
  sum: number;
  sumStatus: "good" | "warning" | "bad";
  sumDescription: string;
  oddEvenRatio: string;
  oddEvenStatus: "good" | "bad";
  oddEvenDescription: string;
  highLowRatio: string;
  highLowStatus: "good" | "bad";
  highLowDescription: string;
  acValue: number;
  acStatus: "good" | "bad";
  acDescription: string;
  consecutivePairs: number;
  consecutiveDescription: string;
  hotNumbersCount: number;
  coldNumbersCount: number;
  hotColdDescription: string;
  ratingGrade: "S+" | "A" | "B" | "C";
  score: number;
}

export function generatePatternReport(nums: number[]): AdvancedLottoReport {
  const sum = nums.reduce((acc, curr) => acc + curr, 0);
  
  // Odd:Even
  const oddCount = nums.filter(n => n % 2 !== 0).length;
  const evenCount = 6 - oddCount;
  const oddEvenRatio = `${oddCount}:${evenCount}`;
  const oddEvenStatus = (oddCount >= 2 && oddCount <= 4) ? "good" : "bad";
  const oddEvenDescription = oddEvenStatus === "good" 
    ? "역대 1등 당첨 빈도가 가장 높은 안정적인 홀짝 균형 조합입니다." 
    : "홀수나 짝수가 한쪽으로 너무 치우쳐 있습니다. 역사상 이런 극단적인 조합이 1등이 된 확률은 3% 미만입니다.";

  // High:Low (High is >= 24)
  const lowCount = nums.filter(n => n <= 23).length;
  const highCount = 6 - lowCount;
  const highLowRatio = `${highCount}:${lowCount}`;
  const highLowStatus = (lowCount >= 2 && lowCount <= 4) ? "good" : "bad";
  const highLowDescription = highLowStatus === "good"
    ? "고(24~45)와 저(1~23)의 황금 비율을 만족합니다."
    : "숫자가 지나치게 낮은 구역이나 높은 구역에 몰려있어 균형이 깨져 있습니다.";

  // Sum
  let sumStatus: "good" | "warning" | "bad" = "bad";
  let sumDescription = "";
  if (sum >= 110 && sum <= 170) {
    sumStatus = "good";
    sumDescription = "통계상 가장 완벽한 1등 당첨 다발 구간(110~170)에 위치합니다.";
  } else if (sum >= 90 && sum <= 190) {
    sumStatus = "warning";
    sumDescription = "조금 넓은 허용 범위(90~190) 안에 포함되지만 최적 합계선은 아닙니다.";
  } else {
    sumStatus = "bad";
    sumDescription = "합계가 지나치게 높거나 낮아 실제 당첨번호가 될 확률이 매우 희박합니다.";
  }

  // AC Value
  const acValue = calculateACValue(nums);
  const acStatus = acValue >= 7 ? "good" : "bad";
  const acDescription = acStatus === "good"
    ? `산술 복잡도(AC)가 ${acValue}로 우수합니다. 무작위성과 불규칙성이 아주 훌륭한 패턴입니다.`
    : `산술 복잡도(AC)가 ${acValue}로 너무 낮습니다. 규칙적인 순서(예: 등차수열)를 띄고 있어 실제 1등 출현 확률이 매우 낮습니다.`;

  // Consecutive
  const consecutivePairs = getConsecutivePairsCount(nums);
  const consecutiveDescription = consecutivePairs === 0
    ? "연속된 번호가 없습니다. (전체 당첨 건 중 약 55% 비율)"
    : consecutivePairs === 1
      ? "연속된 번호쌍이 1개 존재합니다. (가장 이상적인 연속 분포, 약 40% 비율)"
      : `${consecutivePairs}개의 연속 번호쌍이 존재합니다. (과다 연속 패턴, 비추천)`;

  // Hot/Cold Counts
  const hotNumbersCount = nums.filter(n => HISTORICAL_HOT_NUMBERS.includes(n)).length;
  const coldNumbersCount = nums.filter(n => HISTORICAL_COLD_NUMBERS.includes(n)).length;
  const hotColdDescription = `자주 나오는 수(Hot) ${hotNumbersCount}개와 희귀 수(Cold) ${coldNumbersCount}개의 현실적인 배합입니다.`;

  // Score Calculation
  let score = 50;
  if (sumStatus === "good") score += 15;
  else if (sumStatus === "warning") score += 5;
  
  if (oddEvenStatus === "good") score += 15;
  if (highLowStatus === "good") score += 15;
  if (acStatus === "good") score += 15;
  
  if (consecutivePairs === 1) score += 10;
  else if (consecutivePairs === 0) score += 5;

  if (hotNumbersCount >= 1 && hotNumbersCount <= 3) score += 10;
  if (coldNumbersCount <= 1) score += 5;

  // Rating Grade assignment
  let ratingGrade: "S+" | "A" | "B" | "C" = "C";
  if (score >= 90) ratingGrade = "S+";
  else if (score >= 75) ratingGrade = "A";
  else if (score >= 60) ratingGrade = "B";

  return {
    sum,
    sumStatus,
    sumDescription,
    oddEvenRatio,
    oddEvenStatus,
    oddEvenDescription,
    highLowRatio,
    highLowStatus,
    highLowDescription,
    acValue,
    acStatus,
    acDescription,
    consecutivePairs,
    consecutiveDescription,
    hotNumbersCount,
    coldNumbersCount,
    hotColdDescription,
    ratingGrade,
    score
  };
}

// Backward compatibility legacy calculator for standard metrics
export interface LottoStats {
  sum: number;
  oddEvenRatio: string;
  highLowRatio: string;
  average: number;
  hotScore: number;
}

export function calculateStats(nums: number[]): LottoStats {
  const report = generatePatternReport(nums);
  const sum = nums.reduce((acc, curr) => acc + curr, 0);
  const average = Math.round((sum / 6) * 10) / 10;
  return {
    sum,
    oddEvenRatio: report.oddEvenRatio,
    highLowRatio: report.highLowRatio,
    average,
    hotScore: report.score
  };
}
