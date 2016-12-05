describe('model/Sources', function () {
    "use strict";

    const Location = require('../../lib/model/Location');
    const Sources = require('../../lib/model/Sources');
    const Chunk = Sources.Chunk;

    const FILES = [
        'Foo.js',
        'Bar.js',
        'Zip.js'
    ];

    describe('Chunk', function () {
        describe('fieldOf', function () {
            describe('1-tuple', function () {
                const STR = '0';

                it('should return field[0]', function () {
                    var n = Chunk.fieldOf(STR, 0);
                    expect(n).toBe(0);
                });

                it('should return -1 when indexing beyond end', function () {
                    var n = Chunk.fieldOf(STR, 1);
                    expect(n).toBe(-1);
                });
            });

            describe('2-tuple', function () {
                const STR = '21,427';

                it('should return field[0]', function () {
                    var n = Chunk.fieldOf(STR, 0);
                    expect(n).toBe(21);
                });

                it('should return field[1]', function () {
                    var n = Chunk.fieldOf(STR, 1);
                    expect(n).toBe(427);
                });

                it('should return -1 when indexing beyond end', function () {
                    var n = Chunk.fieldOf(STR, 2);
                    expect(n).toBe(-1);
                });
            });

            describe('3-tuple', function () {
                const STR = '42,123,321';

                it('should return field[0]', function () {
                    var n = Chunk.fieldOf(STR, 0);
                    expect(n).toBe(42);
                });

                it('should return field[1]', function () {
                    var n = Chunk.fieldOf(STR, 1);
                    expect(n).toBe(123);
                });

                it('should return field[2]', function () {
                    var n = Chunk.fieldOf(STR, 2);
                    expect(n).toBe(321);
                });

                it('should return -1 when indexing beyond end', function () {
                    var n = Chunk.fieldOf(STR, 3);
                    expect(n).toBe(-1);
                });
            });

            describe('4-tuple', function () {
                const STR = '4,5,6,7';

                it('should return field[0]', function () {
                    var n = Chunk.fieldOf(STR, 0);
                    expect(n).toBe(4);
                });

                it('should return field[1]', function () {
                    var n = Chunk.fieldOf(STR, 1);
                    expect(n).toBe(5);
                });

                it('should return field[2]', function () {
                    var n = Chunk.fieldOf(STR, 2);
                    expect(n).toBe(6);
                });

                it('should return field[3]', function () {
                    var n = Chunk.fieldOf(STR, 3);
                    expect(n).toBe(7);
                });

                it('should return -1 when indexing beyond end', function () {
                    var n = Chunk.fieldOf(STR, 4);
                    expect(n).toBe(-1);
                });
            });
        }); // fieldOf

        describe('from', function () {
            it('should parse a 3-tuple', function () {
                var c = Chunk.from('123,456,789');

                expect(c.file).toBe(123);
                expect(c.line).toBe(456);
                expect(c.column).toBe(789);
                expect(c.length).toBe(-1);
            });

            it('should parse a 4-tuple', function () {
                var c = Chunk.from('123,456,789,2468');

                expect(c.file).toBe(123);
                expect(c.line).toBe(456);
                expect(c.column).toBe(789);
                expect(c.length).toBe(2468);
            });
        });

        describe('from / init', function () {
            it('should support a 3-tuple', function () {
                var c = Chunk.from('1,456,789').init({ files: FILES }, 0);

                expect(c.file).toBe('Bar.js');
                expect(c.line).toBe(456);
                expect(c.column).toBe(789);
                expect(c.length).toBe(-1);
            });

            it('should parse a 4-tuple', function () {
                var c = Chunk.from('0,456,789,2468').init({ files: FILES }, 100);

                expect(c.file).toBe('Foo.js');
                expect(c.line).toBe(456);
                expect(c.column).toBe(789);
                expect(c.length).toBe(2468);
                expect(c.begin).toBe(100);
                expect(c.end).toBe(2468 + 100);
            });
        });
    }); // Chunk

    describe('Sources', function () {
        const A = 6;
        const B = 7;
        const C = 4;

        beforeEach(function () {
            this.src2 = new Sources(FILES, 'Hello World!!', `0,2,4,${A}:1,3,5,${B}`);
            this.src3 = new Sources(FILES, 'Hello World!! Yo!', `0,2,4,${A}:1,3,5,${B}:2,42,427,${C}`);
            this.src4 = new Sources(FILES, 'He\nlo Wo\nld\n! Y\n!', `0,2,4,${A}:1,3,5,${B}:2,42,427,${C}`);
        });

        describe('first chunk', function () {
            it('should have correct file', function () {
                var c = this.src2.chunks[0];
                expect(c.file).toBe('Foo.js');
            });
            it('should have correct line', function () {
                var c = this.src2.chunks[0];
                expect(c.line).toBe(2);
            });
            it('should have correct column', function () {
                var c = this.src2.chunks[0];
                expect(c.column).toBe(4);
            });
            it('should have correct length', function () {
                var c = this.src2.chunks[0];
                expect(c.length).toBe(6);
            });
            it('should have correct begin', function () {
                var c = this.src2.chunks[0];
                expect(c.begin).toBe(0);
            });
            it('should have correct end', function () {
                var c = this.src2.chunks[0];
                expect(c.end).toBe(6);
            });
            it('should have the correct text', function () {
                var c = this.src2.chunks[0];
                expect(c.text).toBe('Hello ');
            });
        });

        describe('second chunk', function () {
            it('should have correct file', function () {
                var c = this.src2.chunks[1];
                expect(c.file).toBe('Bar.js');
            });
            it('should have correct line', function () {
                var c = this.src2.chunks[1];
                expect(c.line).toBe(3);
            });
            it('should have correct column', function () {
                var c = this.src2.chunks[1];
                expect(c.column).toBe(5);
            });
            it('should have correct length', function () {
                var c = this.src2.chunks[1];
                expect(c.length).toBe(7);
            });
            it('should have correct begin', function () {
                var c = this.src2.chunks[1];
                expect(c.begin).toBe(6);
            });
            it('should have correct end', function () {
                var c = this.src2.chunks[1];
                expect(c.end).toBe(6+7);
            });
            it('should have the correct text', function () {
                var c = this.src2.chunks[1];
                expect(c.text).toBe('World!!');
            });
        });

        describe('at', function () {
            describe('first block', function () {
                it('should handle offset 0', function () {
                    var c = this.src4.at(0);
                    var s = c.toString();

                    expect(s).toBe('Foo.js:2:4');
                });

                it('should handle offset 3', function () {
                    var c = this.src4.at(3);
                    var s = c.toString();

                    expect(s).toBe('Foo.js:3:4');
                });

                it('should handle offset 0, full size', function () {
                    var c = this.src4.at(3);
                    var s = c.toString();

                    expect(s).toBe('Foo.js:3:4');
                });

                it('should handle offset -1 from end', function () {
                    var c = this.src4.at(A-1);
                    var s = c.toString();

                    expect(s).toBe('Foo.js:3:6');
                });
            });
        }); // at
        
        describe('chunkIndexFromOffset', function () {
            it('should handle offset -1', function () {
                var c = this.src2.chunkIndexFromOffset(-1);
                expect(c).toBe(-1);

                c = this.src2.chunkFromOffset(-1);
                expect(c).toBe(null);
            });

            it('should handle offset 0', function () {
                var c = this.src2.chunkIndexFromOffset(0);
                expect(c).toBe(0);

                c = this.src2.chunkFromOffset(0);
                expect(c.text).toBe('Hello ');
            });

            it('should handle offset of boundary-1', function () {
                var c = this.src2.chunkIndexFromOffset(A-1);
                expect(c).toBe(0);
            });

            it('should handle offset of boundary', function () {
                var c = this.src2.chunkIndexFromOffset(A);
                expect(c).toBe(1);

                c = this.src2.chunkFromOffset(A);
                expect(c.text).toBe('World!!');
            });

            it('should handle offset of boundary+1', function () {
                var c = this.src2.chunkIndexFromOffset(A+1);
                expect(c).toBe(1);
            });

            it('should handle offset of end-1', function () {
                var c = this.src2.chunkIndexFromOffset(A+B-1);
                expect(c).toBe(1);
            });

            it('should handle offset of end', function () {
                var c = this.src2.chunkIndexFromOffset(A+B);
                expect(c).toBe(-1);

                c = this.src2.chunkFromOffset(A+B);
                expect(c).toBe(null);
            });

            it('should handle offset of end+1', function () {
                var c = this.src2.chunkIndexFromOffset(A+B+1);
                expect(c).toBe(-1);
            });
        }); // chunkIndexFromOffset

        describe('spans', function () {
            describe('first block', function () {
                it('should handle offset 0, length 1', function () {
                    var c = this.src3.chunks[0];

                    expect(c.spans(0)).toBe(true);
                });

                it('should handle offset 0, length 3', function () {
                    var c = this.src3.chunks[0];

                    expect(c.spans(0, 3)).toBe(true);
                });

                it('should handle offset 0, full size', function () {
                    var c = this.src3.chunks[0];

                    expect(c.spans(0, A)).toBe(true);
                });

                it('should handle offset 0, overflow', function () {
                    var c = this.src3.chunks[0];

                    expect(c.spans(0, A+1)).toBe(false);
                });

                it('should handle offset 1, overflow', function () {
                    var c = this.src3.chunks[0];

                    expect(c.spans(1, A)).toBe(false);
                });

                it('should handle offset -1 from end', function () {
                    var c = this.src3.chunks[0];

                    expect(c.spans(A-1)).toBe(true);
                });

                it('should handle offset 1 beyond end', function () {
                    var c = this.src3.chunks[0];

                    expect(c.spans(A)).toBe(false);
                });
            });

            describe('second block', function () {
                it('should handle offset 0, length 1', function () {
                    var c = this.src3.chunks[1];

                    expect(c.spans(A)).toBe(true);
                });

                it('should handle offset 0, length 3', function () {
                    var c = this.src3.chunks[1];

                    expect(c.spans(A, 3)).toBe(true);
                });

                it('should handle offset 0, full size', function () {
                    var c = this.src3.chunks[1];

                    expect(c.spans(A, B)).toBe(true);
                });

                it('should handle offset 0, overflow', function () {
                    var c = this.src3.chunks[1];

                    expect(c.spans(A, B+1)).toBe(false);
                });

                it('should handle offset 1, overflow', function () {
                    var c = this.src3.chunks[1];

                    expect(c.spans(A+1, B)).toBe(false);
                });

                it('should handle offset -1 from end', function () {
                    var c = this.src3.chunks[1];

                    expect(c.spans(A+B-1)).toBe(true);
                });

                it('should handle offset 1 beyond end', function () {
                    var c = this.src3.chunks[1];

                    expect(c.spans(A+B)).toBe(false);
                });
            });

            describe('last block', function () {
                it('should handle offset 0, length 1', function () {
                    var c = this.src3.chunks[2];

                    expect(c.spans(A+B)).toBe(true);
                });

                it('should handle offset 0, length 3', function () {
                    var c = this.src3.chunks[2];

                    expect(c.spans(A+B, 2)).toBe(true);
                });

                it('should handle offset 0, full size', function () {
                    var c = this.src3.chunks[2];

                    expect(c.spans(A+B, C)).toBe(true);
                });

                it('should handle offset 0, overflow', function () {
                    var c = this.src3.chunks[2];

                    expect(c.spans(A+B, C+1)).toBe(false);
                });

                it('should handle offset 1, overflow', function () {
                    var c = this.src3.chunks[2];

                    expect(c.spans(A+B+1, C)).toBe(false);
                });

                it('should handle offset -1 from end', function () {
                    var c = this.src3.chunks[2];

                    expect(c.spans(A+B+C-1)).toBe(true);
                });

                it('should handle offset 1 beyond end', function () {
                    var c = this.src3.chunks[2];

                    expect(c.spans(A+B+C)).toBe(false);
                });
            });
        }); // spans
    }); // Sources
});
