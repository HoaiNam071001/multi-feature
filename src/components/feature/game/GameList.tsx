import { FeatureItem } from "@/components/common/FeatureCard";
import FeatureGrid from "@/components/common/FeatureGrid";
import { RouterPath } from "@/models/router";
import {
  Brain,
  Crown,
  Hash,
  Puzzle,
  Trophy
} from "lucide-react";

export const items: FeatureItem[] = [
  {
    name: "Sudoku",
    url: `${RouterPath.MINI_GAME}/sudoku`,
    icon: <Puzzle className="w-6 h-6" />,
    description:
      "Trò chơi điền số logic 9x9 giúp rèn luyện tư duy và kiên nhẫn",
  },
  {
    name: "Memory Match",
    url: `${RouterPath.MINI_GAME}/memory-match`,
    icon: <Brain className="w-6 h-6" />,
    description:
      "Trò chơi lật thẻ tìm cặp giống nhau, cải thiện trí nhớ ngắn hạn",
  },
  {
    name: "2048",
    url: `${RouterPath.MINI_GAME}/game2048`,
    icon: <Hash className="w-6 h-6" />,
    description:
      "Trò chơi gộp số chiến lược, phát triển tư duy dự đoán và lập kế hoạch",
  },
  {
    name: "Chess Game",
    url: `${RouterPath.MINI_GAME}/chess-game`,
    icon: <Crown className="w-6 h-6" />,
    description:
      "Cờ vua 2 người chơi, phát triển tư duy chiến lược và giải quyết vấn đề",
  },
  {
    name: "Ô Ăn Quan",
    url: `${RouterPath.MINI_GAME}/o-an-quan`,
    icon: <Trophy className="w-6 h-6" />,
    description:
      "Trò chơi dân gian truyền thống, rèn luyện tư duy chiến lược và tính toán",
  },
];

const GameList = () => {
  return (
    <section className="min-h-[700px]">
      <div className="mx-auto">
        <FeatureGrid features={items} title="Các Trò Chơi Trí Tuệ" />
      </div>
    </section>
  );
};

export default GameList;
