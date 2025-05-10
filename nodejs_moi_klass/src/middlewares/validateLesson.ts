import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';

export const validateLessonQuery = (req: Request, res: Response, next: NextFunction) => {
    const {
        date,
        status,
        teacherIds,
        studentsCount,
        page = '1',
        lessonsPerPage = '5'
    } = req.query;

    const errors: string[] = [];

    const isPositiveNumber = (e: unknown) => e == null || /^[1-9]\d*$/.test(e as string);
    if (!isPositiveNumber(page)) {
        errors.push(`Некорректное значение параметра page [${page}]`);
    }

    if (!isPositiveNumber(lessonsPerPage)) {
        errors.push(`Некорректное значение параметра lessonsPerPage [${lessonsPerPage}]`);
    }

    if (status != null && !/^[01]$/.test(status as string)) {
        errors.push(`Параметр status должен быть 0 или 1 [${status}]`);
    }

    if (teacherIds != null && !/^\d+(?:,\d+)*$/.test(teacherIds as string)) {
        errors.push(`Параметр teacherIds должен содержать числа через запятую [${teacherIds}]`);
    }

    if (studentsCount != null && !/^\d+(?:,\d+)?$/.test(studentsCount as string)) {
        errors.push(`Параметр studentsCount должен быть числом или двумя числами через запятую [${studentsCount}]`);
    }

    const dateRegexp = "\\d{4}-\\d{2}-\\d{2}";
    if (date != null) {
        const match = (date as string).match(new RegExp(`^(${dateRegexp})(?:,(${dateRegexp}))?$`));
        if (!match || !match.slice(1, 3).every(e => {
            const parsed = e != null && dayjs(e, "YYYY-MM-DD", true);
            return !parsed || parsed.isValid() && parsed.format("YYYY-MM-DD") === e;
        })) {
            errors.push(`Параметр date должен быть одной или двумя датами в формате YYYY-MM-DD [${date}]`);
        }
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        next();
    }
};
