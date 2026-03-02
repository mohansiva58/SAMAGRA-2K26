## UI Pro Max Stack Guidelines
**Stack:** nextjs | **Query:** animation accessibility performance nextjs
**Source:** stacks/nextjs.csv | **Found:** 3 results

### Result 1
- **Category:** Performance
- **Guideline:** Analyze bundle size
- **Description:** Use @next/bundle-analyzer
- **Do:** Bundle analyzer in dev
- **Don't:** Ship large bundles blindly
- **Code Good:** ANALYZE=true npm run build
- **Code Bad:** No bundle analysis
- **Severity:** Medium
- **Docs URL:** https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer

### Result 2
- **Category:** Performance
- **Guideline:** Avoid layout shifts
- **Description:** Reserve space for dynamic content
- **Do:** Skeleton loaders aspect ratios
- **Don't:** Content popping in
- **Code Good:** <Skeleton className="h-48"/>
- **Code Bad:** No placeholder for async content
- **Severity:** High
- **Docs URL:** 

### Result 3
- **Category:** Performance
- **Guideline:** Use dynamic imports
- **Description:** Code split with next/dynamic
- **Do:** dynamic() for heavy components
- **Don't:** Import everything statically
- **Code Good:** const Chart = dynamic(() => import('./Chart'))
- **Code Bad:** import Chart from './Chart'
- **Severity:** Medium
- **Docs URL:** https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading

