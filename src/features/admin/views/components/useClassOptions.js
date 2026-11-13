/**
 * useClassOptions — the LIVE class list for every picker that chooses a
 * class. Created and renamed classes appear in the enrol form, the student
 * move sheet, the fee-plan form and the list filter immediately, instead of
 * the old hardcoded seven (which is why a brand-new class could not be
 * moved into or billed). Falls back to the default seven until the load
 * answers, so the picker is never empty.
 */
import { useEffect, useState } from 'react';
import { AcademicStructureModel } from '../../models';

const FALLBACK = ['JSS1 A', 'JSS1 B', 'JSS2 A', 'JSS3 A', 'SSS1 A', 'SSS2 A', 'SSS3 A'].map(
  (c) => ({ label: c, value: c }),
);

export default function useClassOptions() {
  const [options, setOptions] = useState(FALLBACK);

  useEffect(() => {
    let alive = true;
    AcademicStructureModel.classes()
      .then((page) => {
        if (!alive) return;
        const items = (page && page.items) || [];
        if (items.length) {
          setOptions(
            items.map((c) => ({ label: c.classLabel, value: c.classLabel })),
          );
        }
      })
      .catch(() => {}); // keep the fallback list — the screens still work
    return () => {
      alive = false;
    };
  }, []);

  return options;
}
