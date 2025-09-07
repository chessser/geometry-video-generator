#!/bin/bash

case "$1" in
  dev)
    npm run dev --prefix luminara/apps/web
    ;;
  build)
    npm run build --prefix luminara/apps/web
    ;;
  preview)
    npm run preview --prefix luminara/apps/web
    ;;
  test)
    npm test --prefix luminara/apps/web
    ;;
  all)
    npm test --prefix luminara/apps/web && \
    npm run build --prefix luminara/apps/web && \
    npm run preview --prefix luminara/apps/web
    ;;
  kill)
    pkill -f "luminara" 2>/dev/null || true
    lsof -ti:5173,4173 2>/dev/null | xargs kill -9 2>/dev/null || true
    echo "Killed all luminara processes"
    ;;
  coverage)
    npm run test --prefix luminara/apps/web -- --coverage
    ;;
  *)
    echo "Usage: ./run.sh [dev|build|preview|test|all|kill|coverage]"
    echo "  dev      - Start development server (auto-opens Chrome)"
    echo "  build    - Build for production"
    echo "  preview  - Preview production build (auto-opens Chrome)"
    echo "  test     - Run unit tests"
    echo "  coverage - Run tests with coverage report"
    echo "  all      - Run test, build, and preview"
    echo "  kill     - Kill all running luminara processes"
    ;;
esac