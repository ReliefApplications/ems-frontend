import { SurveyModel } from 'survey-core';

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
    const MATRIX_TYPES = ['matrix', 'matrixdropdown', 'matrixdynamic'];
    this.survey.getAllQuestions().forEach((question) => {
      // Check if question is a matrix
      if (!MATRIX_TYPES.includes(question.getType())) {
        return;
      }

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
   * Update the rows of a matrix
   *
   * @param matrixName Name of the matrix to update
   */
  private updateMatrixRows(matrixName: string): void {
    const matrix = this.survey.getQuestionByName(matrixName);
    const copyFrom = this.copyMap.get(matrixName)?.rows;

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
   * @param matrixName Name of the matrix to update
   */
  private updateMatrixColumns(matrixName: string): void {
    const matrix = this.survey.getQuestionByName(matrixName);
    const copyFrom = this.copyMap.get(matrixName)?.columns;

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
   * @param matrixName Matrix that will have its rows/columns copied
   * @param copyFrom Object with the names of the matrixes to copy from
   * @param copyFrom.rows Name of the matrix to copy rows from
   * @param copyFrom.columns Name of the matrix to copy columns from
   */
  public addCopyConfig(
    matrixName: string,
    copyFrom?: { rows?: string; columns?: string }
  ): void {
    this.copyMap.set(matrixName, copyFrom || {});
    this.setupListeners();

    if (copyFrom?.rows) {
      this.updateMatrixRows(matrixName);
    }
    if (copyFrom?.columns) {
      this.updateMatrixColumns(matrixName);
    }
  }
}
