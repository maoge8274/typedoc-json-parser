import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { SignatureParser, SourceParser } from '../misc';
import { Parser } from '../Parser';

/**
 * Parses data from an interface method reflection.
 * @since 3.1.0
 */
export class InterfaceMethodParser extends Parser {
  /**
   * The id of the parent interface parser.
   * @since 4.0.0
   */
  public readonly parentId: number;

  /**
   * The signature parsers of this method.
   * @since 3.1.0
   */
  public readonly signatures: SignatureParser[];

  public constructor(data: InterfaceMethodParser.Data) {
    super(data);

    const { parentId, signatures } = data;

    this.parentId = parentId;
    this.signatures = signatures;
  }

  /**
   * Convert this parser to a JSON compatible format.
   * @since 3.1.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): InterfaceMethodParser.JSON {
    return {
      ...super.toJSON(),
      parentId: this.parentId,
      signatures: this.signatures.map((signature) => signature.toJSON())
    };
  }

  /**
   * Generates a new {@link InterfaceMethodParser} instance from the given data.
   * @since 3.1.0
   * @param reflection The reflection to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, parentId: number): InterfaceMethodParser {
    const { kind, kindString = 'Unknown', id, name, sources = [], signatures = [] } = reflection;

    if (kind !== ReflectionKind.Method) throw new Error(`Expected Method (${ReflectionKind.Method}), but received ${kindString} (${kind})`);

    return new InterfaceMethodParser({
      id,
      name,
      source: sources.length ? SourceParser.generateFromTypeDoc(sources[0]) : null,
      parentId,
      signatures: signatures.map((signature) => SignatureParser.generateFromTypeDoc(signature))
    });
  }

  /**
   * Generates a new {@link InterfaceMethodParser} instance from the given data.
   * @param json The json to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromJSON(json: InterfaceMethodParser.JSON): InterfaceMethodParser {
    const { id, name, source, parentId, signatures } = json;

    return new InterfaceMethodParser({
      id,
      name,
      source: source ? SourceParser.generateFromJSON(source) : null,
      parentId,
      signatures: signatures.map((signature) => SignatureParser.generateFromJSON(signature))
    });
  }
}

export namespace InterfaceMethodParser {
  export interface Data extends Parser.Data {
    /**
     * The id of the parent interface parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The signature parsers of this method.
     * @since 3.1.0
     */
    signatures: SignatureParser[];
  }

  export interface JSON extends Parser.JSON {
    /**
     * The id of the parent interface parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The signature parsers of this method in a JSON compatible format.
     * @since 3.1.0
     */
    signatures: SignatureParser.JSON[];
  }
}
