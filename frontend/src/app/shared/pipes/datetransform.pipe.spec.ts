import { DatePipe } from './datetransform.pipe';

describe('DatePipe', () => {
    it('create an instance', () => {
        const pipe = new DatePipe();
        expect(pipe).toBeTruthy();
    });
});
