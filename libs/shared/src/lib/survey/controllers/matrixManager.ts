import { flatten } from 'lodash';
import { Question, SurveyModel } from 'survey-core';

/** Class that manages copy of rows/columns between questions */
export class MatrixManager {
  /** Maps each matrix to the matrixes it copies its rows and/or columns from */
  private copyMap: Map<string, { rows?: string; columns?: string }> = new Map();

  /**
   * Class that manages copy of rows/columns between questions
   *
   * @param survey SurveyJS object
   */
  constructor(private survey: SurveyModel) {
    survey.matrixManager = this;
    this.init();
    this.setupListeners();
  }

  /** Initialized questions to look for changes */
  private init(): void {
    this.getMatrixQuestions().forEach((question) => {
      // If so, check the the copyRowsFromAnotherMatrix and copyColumnsFromAnotherMatrix properties
      const copyRowFrom: string | undefined = question.getPropertyValue(
        'copyRowsFromAnotherMatrix'
      );

      const copyColumnsFrom: string | undefined = question.getPropertyValue(
        'copyColumnsFromAnotherMatrix'
      );

      // Add dependencies to the map
      if (copyColumnsFrom || copyRowFrom) {
        this.copyMap.set(question.name, {
          rows: copyRowFrom,
          columns: copyColumnsFrom,
        });
      }
    });
  }

  /** Setup listeners to update questions when needed */
  private setupListeners(): void {
    for (const [matrixName, matrixCopy] of this.copyMap) {
      if (matrixCopy.rows) {
        const copyFrom = this.survey.getQuestionByName(matrixCopy.rows);
        if (copyFrom) {
          // Listen to row changes
          copyFrom.onItemValuePropertyChanged.add((_, options) => {
            if (options.propertyName === 'rows') {
              this.updateMatrixRows(matrixName);
            }
          });
        }
      }

      if (matrixCopy.columns) {
        const copyFrom = this.survey.getQuestionByName(matrixCopy.columns);
        if (copyFrom) {
          // For some reason, surveyJS doesn't throw an event when columns are updated
          // Instead, we update the columns when the question is focused or blurred
          copyFrom.onPropertyChanged.add(() => {
            this.updateMatrixColumns(matrixName);
          });
        }
      }
    }
  }

  /**
   * Gets all matrix questions, including those in dynamic panels
   *
   * @returns Array of matrix questions
   */
  public getMatrixQuestions(): Question[] {
    const MATRIX_TYPES = ['matrix', 'matrixdropdown', 'matrixdynamic'];
    return flatten(
      this.survey.getAllQuestions().map((q) => {
        if (q.getType() === 'paneldynamic') {
          return q.templateElements;
        }
        return q;
      })
    ).filter((q) => MATRIX_TYPES.includes(q.getType()));
  }

  /**
   * Returns all the questions of the matrix, including those in templates of dynamic panels
   *
   * @param id ID of the matrix
   * @returns array of questions
   */
  private getQuestionById(id: string): Question | undefined {
    return this.getMatrixQuestions().find((q) => q.id === id);
  }

  /**
   * Update the rows of a matrix
   *
   * @param matrixID ID of the matrix to update
   */
  private updateMatrixRows(matrixID: string): void {
    const matrix = this.getQuestionById(matrixID);
    const copyFrom = this.copyMap.get(matrixID)?.rows;

    if (!matrix || !copyFrom) {
      return;
    }

    const matrixCopy = this.survey.getQuestionByName(copyFrom);

    if (!matrixCopy) {
      return;
    }

    matrix.rows = matrixCopy.rows;
    matrix.choices = matrixCopy.choices;
  }

  /**
   * Update the columns of a matrix
   *
   * @param matrixID Name of the matrix to update
   */
  private updateMatrixColumns(matrixID: string): void {
    const matrix = this.getQuestionById(matrixID);
    const copyFrom = this.copyMap.get(matrixID)?.columns;

    if (!matrix || !copyFrom) {
      return;
    }

    const matrixCopy = this.survey.getQuestionByName(copyFrom);

    if (!matrixCopy) {
      return;
    }

    matrix.columns = matrixCopy.columns;
  }

  /**
   * Add a matrix to the copy map
   *
   * @param matrix ID of the matrix that will have its rows/columns copied
   * @param copyFrom Object with the names of the matrixes to copy from
   * @param copyFrom.rows Name of the matrix to copy rows from
   * @param copyFrom.columns Name of the matrix to copy columns from
   */
  public addCopyConfig(
    matrix: string,
    copyFrom?: { rows?: string; columns?: string }
  ): void {
    this.copyMap.set(matrix, copyFrom || {});
    this.setupListeners();

    if (copyFrom?.rows) {
      this.updateMatrixRows(matrix);
    }
    if (copyFrom?.columns) {
      this.updateMatrixColumns(matrix);
    }
  }
}
