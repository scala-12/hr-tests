import { Router } from 'express';
import knexLib from '../db/knex';
import { validateLessonQuery } from '../middlewares/validateLesson';

const router = Router();

router.get('/', validateLessonQuery, async (
  { query: {
    date, // Либо одна дата в формате YYYY-MM-DD, либо две в таком же формате через запятую (например, «2019-01-01,2019-09-01». Если указана одна дата, выбираются занятия на эту дату. Если указаны 2 даты, то выбираются занятия за период, включая указанные даты.
    status, // Статус занятия. принимается либо 0 (не проведено), либо 1 (проведено)
    teacherIds, // id учителей через запятую. Выбираются все занятия, которые ведет хотя бы один из указанных учителей.    
    studentsCount, // количество записанных на занятия учеников. либо одно число (тогда выбирается занятие с точным числом записанных), либо 2 числа через запятую, тогда они рассматриваются как диапазон и выбираются занятия с количеством записанных, попадающих в диапазон включительно.
    page = '1',
    lessonsPerPage = '5',
  } },
  res
) => {
  try {
    const perPage = Number(lessonsPerPage);
    const offset = (Number(page) - 1) * perPage;

    const students2Lesson = knexLib("lesson_students")
      .leftJoin("students", "lesson_students.student_id", "students.id")
      .select(
        "lesson_students.lesson_id",
        knexLib.raw(`
          COUNT(DISTINCT students.id)
          FILTER (WHERE lesson_students.visit = true)::int AS visit_count`),
        knexLib.raw(`
          ARRAY_AGG(
            DISTINCT JSONB_BUILD_OBJECT('id', students.id, 'name', students.name)
          ) FILTER (WHERE students.id IS NOT NULL) AS students`
        )
      ).groupBy("lesson_students.lesson_id");

    const teachers2Lesson = knexLib("lesson_teachers")
      .leftJoin("teachers", "lesson_teachers.teacher_id", "teachers.id")
      .select(
        "lesson_teachers.lesson_id",
        knexLib.raw(`
          ARRAY_AGG(teachers.id) FILTER (WHERE teachers.id IS NOT NULL) AS teachers_ids`
        )
      ).groupBy("lesson_teachers.lesson_id");

    const result = await knexLib.with('students2Lesson', qb => {
      qb.select(
        'lesson_students.lesson_id',
        knexLib.raw(`
            COUNT(DISTINCT students.id) FILTER (WHERE lesson_students.visit = true)::int AS visit_count
          `),
        knexLib.raw(`
            ARRAY_AGG(
              DISTINCT JSONB_BUILD_OBJECT('id', students.id, 'name', students.name)
            ) FILTER (WHERE students.id IS NOT NULL) AS students
          `)
      )
        .from('lesson_students')
        .leftJoin('students', 'lesson_students.student_id', 'students.id')
        .groupBy('lesson_students.lesson_id');
    })
      .with('teachers2Lesson', qb => {
        qb.select(
          'lesson_teachers.lesson_id',
          knexLib.raw(`
            ARRAY_AGG(teachers.id) FILTER (WHERE teachers.id IS NOT NULL) AS teachers_ids
          `)
        )
          .from('lesson_teachers')
          .leftJoin('teachers', 'lesson_teachers.teacher_id', 'teachers.id')
          .groupBy('lesson_teachers.lesson_id');
      })
      .from('lessons')
      .leftJoin('students2Lesson as s', 'lessons.id', 's.lesson_id')
      .leftJoin('teachers2Lesson as t', 'lessons.id', 't.lesson_id')
      .select(
        'lessons.id',
        'lessons.date',
        'lessons.title',
        'lessons.status',
        knexLib.raw('COALESCE(s.visit_count, 0) as "visitCount"'),
        knexLib.raw("COALESCE(s.students, '{}') as students")
      )
      .modify(query => {
        const dates = date ? (date as string).split(',').sort() : null;
        if (dates) {
          if (dates[1]) {
            query.whereBetween("lessons.date", [dates[0], dates[1]]);
          } else {
            query.where('lessons.date', '>=', dates[0])
              .andWhere('lessons.date', '<', knexLib.raw(`(?::date + interval '1 day')`, [dates[0]]));
          }
        }

        if (status != null) {
          query.where("lessons.status", status);
        }

        const teacherIdList = teacherIds ?
          (teacherIds as string).split(',').map(Number)
          : undefined;
        if (teacherIdList?.length) {
          query.whereRaw('t.teachers_ids && ARRAY[??]::int[]', [teacherIdList]);
        }

        const sCount = studentsCount ?
          (studentsCount as string).split(',').map(Number).sort((a, b) => a - b)
          : null;
        if (sCount != null) {
          if (sCount.length === 1) {
            query.where("s.visit_count", sCount[0]);
          } else {
            query.whereBetween("s.visit_count", [sCount[0], sCount[1]]);
          }
        }
      })
      .orderBy("lessons.date", "desc")
      .limit(perPage)
      .offset(offset);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
