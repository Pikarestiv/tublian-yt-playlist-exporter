export interface RoadmapWrap {
  createdAt: number;
  roadmap: Roadmaps;
  roadmapId: string;
  roadmapState: string;
  status: boolean;
  updatedAt: number;
  userId: string;
}

export interface Roadmaps {
  id: string;
  image?: string;
  // introduction: string;
  internalLearningPrompt: string;
  learningPrompt: string;
  phases: Phase[];
  userId?: string;

  roadmapType?: string; // godeeper
  queryType: string; // ai or user
}

export interface Phase {
  id: string;
  overview: string;
  phaseTitle: string;
  sections: Section[];
  tags: string[];
}

export interface Section {
  learningObjectives: string[];
  description: string;
  tags: string[];
  title: string;
}

export type ILearningProgress = {
  // contentFilters: FilterOptions;
  prompt?: string;
  roadmapId?: string;
  pathwayId: string | number | undefined;
  progress: ProgressType;
  score: number;
  startedAt: number;
  status: boolean;
  updatedAt: number;
  userId: string;
};

export type ProgressType = {
  contentFilters: FilterOptions;
  lastAccessedSection?: 1 | 2 | 3 | 4;
} & Record<string | number, ActiveSectionContentType>;

export type FilterContentType = "video" | "blog" | "both";

export type FilterOptions = {
  contentType: FilterContentType;
  // timeFrame: 1 | 3 | 6 | 12 | 24; // In months
  timeFrame: 3 | 9 | 15; // In months
};

export type ContentItem = {
  date: string;
  id: string;
  link: string;
  more_details: string[];
  snippet: string;
  thumbnail: string;
  title: string;
  status?: boolean;
  resourceType?: "link" | "video";
};

export type LearningObjective = {
  summary: string[];
  learningObjective: string;
};

export type ActiveSectionContentType = {
  completedTasks: (string | number)[];
  isContentPopulated: boolean;
  learningObjectives: LearningObjective[];
  // openTasks?: (string | number)[];
  openTasks: any[];
  status: boolean | string;
  content: ContentItem[];
  bonusContent: ContentItem[];
};
