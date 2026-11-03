(() => {
  const FILTER_WRAPPER_SELECTOR = '[data-filter="filter"]';
  const FILTER_ITEM_SELECTOR = '.projects_filter-item[data-filter="tag"]';
  const PROJECT_LIST_SELECTOR = '[data-filter="list"]';
  const PROJECT_ITEM_SELECTOR = '.projects_item, .projects_list-item, .preview-item';
  const PROJECT_TAG_SELECTOR = '[data-filter="tag"]';
  const ACTIVE_CLASS = 'is-active';
  const OUT_DURATION_MS = 340;
  const IN_DURATION_MS = 520;
  const STAGGER_MS = 80;
  const TRANSITION_GAP_MS = 70;

  function normalize(value) {
    return (value || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function readTagValue(element) {
    return normalize(
      element.getAttribute('data-filter-value') ||
        element.getAttribute('data-tag') ||
        element.textContent
    );
  }

  function collectProjectTags(projectItem) {
    const tags = Array.from(projectItem.querySelectorAll(PROJECT_TAG_SELECTOR))
      .map(readTagValue)
      .filter(Boolean);
    const fallbackTagList = projectItem.querySelector('.projects_tag-list');
    if (fallbackTagList) {
      fallbackTagList.textContent
        .split(',')
        .map((t) => normalize(t))
        .filter(Boolean)
        .forEach((t) => tags.push(t));
    }
    return new Set(tags);
  }

  function setProjectVisibility(projectItem, isVisible) {
    projectItem.style.display = isVisible ? '' : 'none';
  }

  function prepareAnimationStyles(projectItem, mode) {
    if (mode === 'out') {
      projectItem.style.transition =
        `opacity ${OUT_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), ` +
        `transform ${OUT_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    } else {
      projectItem.style.transition =
        `opacity ${IN_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), ` +
        `transform ${IN_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    }
    projectItem.style.willChange = 'opacity, transform';
  }

  function animateListFilter(list, shouldShow) {
    const projectItems = Array.from(list.querySelectorAll(PROJECT_ITEM_SELECTOR));
    if (!projectItems.length) return;

    const visibleNow = projectItems.filter((item) => item.style.display !== 'none');

    projectItems.forEach((item) => prepareAnimationStyles(item, 'out'));
    visibleNow.forEach((item, index) => {
      item.style.transitionDelay = `${index * STAGGER_MS}ms`;
      item.style.opacity = '0';
      item.style.transform = 'translateY(6px) scale(0.992)';
    });

    if (list.__filterTimer) {
      clearTimeout(list.__filterTimer);
    }

    const totalOutMs = OUT_DURATION_MS + TRANSITION_GAP_MS;

    list.__filterTimer = setTimeout(() => {
      projectItems.forEach((item) => {
        setProjectVisibility(item, shouldShow(item));
      });

      projectItems.forEach((item) => prepareAnimationStyles(item, 'in'));
      let visibleIndex = 0;
      projectItems.forEach((item) => {
        if (item.style.display !== 'none') {
          item.style.transitionDelay = `${visibleIndex * STAGGER_MS}ms`;
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px) scale(0.988)';
          visibleIndex += 1;
        } else {
          item.style.transitionDelay = '0ms';
        }
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          projectItems.forEach((item) => {
            if (item.style.display !== 'none') {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }
          });
        });
      });

      const totalInMs = IN_DURATION_MS + Math.max(0, visibleIndex - 1) * STAGGER_MS + 80;
      setTimeout(() => {
        projectItems.forEach((item) => {
          item.style.transition = '';
          item.style.transitionDelay = '';
          item.style.transform = '';
          item.style.willChange = '';

          // Limpa opacity inline depois da animação para permitir hover CSS.
          if (item.style.display !== 'none') {
            item.style.opacity = '';
          }
        });
      }, totalInMs);
    }, totalOutMs);
  }

  function findScopedLists(filterWrapper) {
    const scope =
      filterWrapper.closest('section, main, .section, .page-wrapper') || document;
    const scopedLists = Array.from(scope.querySelectorAll(PROJECT_LIST_SELECTOR));
    const allLists = Array.from(document.querySelectorAll(PROJECT_LIST_SELECTOR));
    return Array.from(new Set([...scopedLists, ...allLists]));
  }

  function applyFilter(filterWrapper, selectedFilterItem) {
    const lists = findScopedLists(filterWrapper);
    if (!lists.length) return;

    const selectedTag = readTagValue(selectedFilterItem);
    const showAll = selectedTag === 'all' || selectedTag === 'todos' || selectedTag === '';

    lists.forEach((list) => {
      const shouldShow = (item) => {
        if (showAll) return true;
        const tags = collectProjectTags(item);
        return tags.has(selectedTag);
      };
      animateListFilter(list, shouldShow);
    });
  }

  function setActiveFilter(filterWrapper, activeItem) {
    const filterItems = Array.from(filterWrapper.querySelectorAll(FILTER_ITEM_SELECTOR));
    filterItems.forEach((item) => item.classList.remove(ACTIVE_CLASS));
    activeItem.classList.add(ACTIVE_CLASS);
  }

  function initFilterWrapper(filterWrapper) {
    const filterItems = Array.from(filterWrapper.querySelectorAll(FILTER_ITEM_SELECTOR));
    if (!filterItems.length) return;
    filterItems.forEach((item) => item.classList.remove(ACTIVE_CLASS));

    filterItems.forEach((item) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        setActiveFilter(filterWrapper, item);
        applyFilter(filterWrapper, item);
      });
    });
  }

  function initProjectsFilter() {
    const wrappers = Array.from(document.querySelectorAll(FILTER_WRAPPER_SELECTOR));
    wrappers.forEach(initFilterWrapper);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsFilter);
  } else {
    initProjectsFilter();
  }
})();
