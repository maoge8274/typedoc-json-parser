import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { CommentParser, SourceParser, TypeParameterParser } from './misc/';
import { Parser } from './Parser';
import { TypeParser } from './type-parsers';

/**
 * Parses data from a type alias reflection.
 * @since 1.0.0
 */
export class TypeAliasParser extends Parser {
  /**
   * The comment parser of this type alias.
   * @since 1.0.0
   */
  public readonly comment: CommentParser;

  /**
   * Whether this type alias is external.
   * @since 1.0.0
   */
  public readonly external: boolean;

  /**
   * The type parameters of this type alias.
   * @since 1.0.0
   */
  public readonly typeParameters: TypeParameterParser[];

  /**
   * The type of this type alias.
   * @since 1.0.0
   */
  public readonly type: TypeParser;

  public constructor(data: TypeAliasParser.Data) {
    super(data);

    const { comment, external, typeParameters, type } = data;

    this.comment = comment;
    this.external = external;
    this.typeParameters = typeParameters;
    this.type = type;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): TypeAliasParser.JSON {
    return {
      ...super.toJSON(),
      comment: this.comment.toJSON(),
      external: this.external,
      typeParameters: this.typeParameters.map((typeParameter) => typeParameter.toJSON()),
      type: this.type.toJSON()
    };
  }

  /**
   * Generates a new {@link TypeAliasParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection): TypeAliasParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], flags, type, typeParameters = [] } = reflection;

    if (kind !== ReflectionKind.TypeAlias) throw new Error(`Expected TypeAlias (${ReflectionKind.TypeAlias}), but received ${kindString} (${kind})`);

    return new TypeAliasParser({
      id,
      name,
      comment: CommentParser.generateFromTypeDoc(comment),
      source: sources.length ? SourceParser.generateFromTypeDoc(sources[0]) : null,
      external: Boolean(flags.isExternal),
      typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generateFromTypeDoc(typeParameter)),
      type: TypeParser.generateFromTypeDoc(type!)
    });
  }

  /**
   * Generates a new {@link TypeAliasParser} instance from the given data.
   * @param json The json to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromJSON(json: TypeAliasParser.JSON): TypeAliasParser {
    const { id, name, comment, source, external, typeParameters, type } = json;

    return new TypeAliasParser({
      id,
      name,
      comment: CommentParser.generateFromJSON(comment),
      source: source ? SourceParser.generateFromJSON(source) : null,
      external,
      typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generateFromJSON(typeParameter)),
      type: TypeParser.generateFromJSON(type)
    });
  }
}

export namespace TypeAliasParser {
  export interface Data extends Parser.Data {
    /**
     * The comment parser of this type alias.
     * @since 1.0.0
     */
    comment: CommentParser;

    /**
     * Whether this type alias is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The type parameters of this type alias.
     * @since 1.0.0
     */
    typeParameters: TypeParameterParser[];

    /**
     * The type of this type alias.
     * @since 1.0.0
     */
    type: TypeParser;
  }

  export interface JSON extends Parser.JSON {
    /**
     * The comment parser of this type alias.
     * @since 1.0.0
     */
    comment: CommentParser.JSON;

    /**
     * Whether this type alias is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The type parameters of this type alias in a JSON compatible format.
     * @since 1.0.0
     */
    typeParameters: TypeParameterParser.JSON[];

    /**
     * The type of this type alias in a JSON compatible format.
     */
    type: TypeParser.JSON;
  }
}
