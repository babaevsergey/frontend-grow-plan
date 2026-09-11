import type { ComponentType } from "react";
import { RenderCommitDiagram } from "./RenderCommitDiagram";
import { CacheInvalidationDiagram } from "./CacheInvalidationDiagram";
import { RefreshTokenDiagram } from "./RefreshTokenDiagram";
import { HydrationDiagram } from "./HydrationDiagram";
import { NextCachingDiagram } from "./NextCachingDiagram";
import { PrototypeChainDiagram } from "./PrototypeChainDiagram";
import { StoreFlowComparisonDiagram } from "./StoreFlowComparisonDiagram";
import { JwtVsSessionDiagram } from "./JwtVsSessionDiagram";
import { TestingPyramidDiagram } from "./TestingPyramidDiagram";
import { FeatureSlicedLayersDiagram } from "./FeatureSlicedLayersDiagram";
import { EventDelegationDiagram } from "./EventDelegationDiagram";
import { RerenderCascadeDiagram } from "./RerenderCascadeDiagram";
import { NormalizationDiagram } from "./NormalizationDiagram";
import { StaleClosureDiagram } from "./StaleClosureDiagram";
import { EventLoopDiagram } from "./EventLoopDiagram";
import { ClosureScopeDiagram } from "./ClosureScopeDiagram";
import { PromiseStateDiagram } from "./PromiseStateDiagram";
import { OptimisticUpdateDiagram } from "./OptimisticUpdateDiagram";
import { NarrowingDiagram } from "./NarrowingDiagram";
import { CriticalRenderingPathDiagram } from "./CriticalRenderingPathDiagram";

/**
 * Диаграммы — по одной на подтему, только там, где схема реально помогает
 * понять механизм быстрее, чем текст. Держим отдельно от content.ts, чтобы
 * данные (content.ts) оставались чистыми JS-объектами, а не смешивались с JSX.
 */
export const DIAGRAMS: Record<string, ComponentType> = {
  "react-rendering": RenderCommitDiagram,
  "react-re-render": RerenderCascadeDiagram,
  "react-stale-closure": StaleClosureDiagram,
  "js-prototypes": PrototypeChainDiagram,
  "js-closures": ClosureScopeDiagram,
  "js-event-loop": EventLoopDiagram,
  "js-promises-async": PromiseStateDiagram,
  "state-zustand-vs-redux": StoreFlowComparisonDiagram,
  "state-normalization": NormalizationDiagram,
  "df-cache-invalidation": CacheInvalidationDiagram,
  "df-optimistic-updates": OptimisticUpdateDiagram,
  "nextjs-hydration": HydrationDiagram,
  "nextjs-caching": NextCachingDiagram,
  "auth-access-refresh-token": RefreshTokenDiagram,
  "auth-jwt-vs-session": JwtVsSessionDiagram,
  "perf-critical-rendering-path": CriticalRenderingPathDiagram,
  "arch-feature-sliced": FeatureSlicedLayersDiagram,
  "testing-pyramid": TestingPyramidDiagram,
  "ts-narrowing": NarrowingDiagram,
  "interview-event-delegation": EventDelegationDiagram,
};
