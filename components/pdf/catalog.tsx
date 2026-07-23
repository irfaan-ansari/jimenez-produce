import { OrganizationSelectType, ProductSelectType } from "@/lib/db/schema";
import { styles } from "./styles";
import { formatPhone, formatUSD } from "@/lib/utils";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { format } from "date-fns";

const colors = {
  background: "#13360c",
  border: "#d9f99d",
  text: "#ffffff",
};

interface CatalogProps {
  org: OrganizationSelectType;
  products: Record<string, ProductSelectType[]>;
  effectiveFrom: string | Date;
  effectiveTo: string | Date;
  featured: ProductSelectType[];
}
export const CatalogPDF = (data: CatalogProps) => {
  const { org, products, effectiveFrom, effectiveTo, featured } = data;

  return (
    <Document>
      <Page
        size="LETTER"
        style={[
          styles.page,
          {
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            paddingVertical: 16,
          },
        ]}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            {
              borderBottom: 0,
              padding: 12,
              justifyContent: "space-between",
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={{ ...styles.headerLeft, gap: 12 }}>
            <View
              style={{
                borderWidth: 2,
                borderColor: colors.border,
                backgroundColor: "#f7fee7",
                width: 60,
                height: 60,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={process.env.BETTER_AUTH_URL + "/logo.png"}
                style={{ ...styles.logo, width: 50 }}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.docTitle,
                  {
                    color: "#fff",
                    marginBottom: 18,
                    textTransform: "uppercase",
                  },
                ]}
              >
                Jimenez Produce
              </Text>
              <Text
                style={[
                  styles.label,
                  {
                    color: "#fff",
                    fontSize: 9,

                    fontWeight: 500,
                  },
                ]}
              >
                Weekly Price List •{" "}
                <Text
                  style={[styles.label, { color: colors.border, fontSize: 9 }]}
                >
                  {org.name}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  ...styles.label,
                  color: "#d9f99d",
                  textAlign: "left",
                  marginRight: 4,
                }}
              >
                Week of &nbsp;•
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "right",
                  color: "#fff",
                }}
              >
                {format(effectiveFrom, "MMMM dd")} -{" "}
                {format(effectiveTo, "MMMM dd")}
              </Text>
            </View>
            <Text
              style={{
                ...styles.label,
                color: "#fff",
                textTransform: "none",
                lineHeight: 1.2,
              }}
            >
              Phone: {formatPhone(org.phone)}
            </Text>
            <Text
              style={{
                ...styles.label,
                color: "#fff",
                textTransform: "none",
                lineHeight: 1.2,
              }}
            >
              Email: {org.email}
            </Text>
          </View>
        </View>

        {/* FEATURED */}
        {featured && featured.length > 0 && (
          <View
            style={{
              gap: 12,
              flexDirection: "row",
              flexWrap: "wrap",
              padding: 12,
              marginTop: 12,
            }}
          >
            {featured.map((product, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: colors.border,
                  backgroundColor: "#f7fee7",
                  borderRadius: 12,
                  padding: 8,
                }}
              >
                <Image
                  src={product.image ?? ""}
                  style={{
                    width: 40,
                    height: 40,
                    alignSelf: "center",
                    marginBottom: 4,
                  }}
                />
                <Text style={[styles.label, { fontSize: 8 }]}>
                  {product.title}
                </Text>
                <Text
                  style={[
                    styles.tagline,
                    { color: colors.background, fontWeight: "bold" },
                  ]}
                >
                  {formatUSD(product.basePrice)}
                </Text>
              </View>
            ))}
          </View>
        )}
        {/* DYNAMIC CATEGORY BLOCKS LOOP */}
        {Object.entries(products).map(
          ([category, categoryProducts]: [string, any], i) => {
            // Split products into rows of 2
            const rows = [];
            for (let j = 0; j < categoryProducts.length; j += 2) {
              rows.push(categoryProducts.slice(j, j + 2));
            }

            const renderRow = (col: any[], rowIndex: number) => (
              <View
                style={{
                  flexDirection: "row",
                  borderTopWidth: rowIndex > 0 ? 1 : 0,
                  borderTopColor: "#f2f5f3",
                }}
                key={rowIndex}
              >
                {col.map((product: ProductSelectType) => (
                  <View
                    key={product.id}
                    style={{
                      width: "50%",
                      flexDirection: "row",
                      paddingHorizontal: 12,
                      paddingTop: 3,
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text
                      style={[
                        styles.label,
                        {
                          fontSize: 8,
                          textTransform: "none",
                          minWidth: 0,
                          lineHeight: 1.5,
                          paddingRight: 4,
                          flex: 1,
                        },
                      ]}
                    >
                      {product.title}
                    </Text>
                    <Text
                      style={[
                        styles.tagline,
                        {
                          color: colors.background,
                          fontWeight: "bold",
                          fontSize: 8,
                          flexShrink: 0,
                          lineHeight: 1.5,
                        },
                      ]}
                    >
                      {formatUSD(product.basePrice)}
                      {product.unit && <>/{product.unit}</>}
                    </Text>
                  </View>
                ))}
              </View>
            );

            return (
              <View style={{ backgroundColor: "#fff" }} key={category}>
                {/* Header + first row locked together so the header
            can never be orphaned at the bottom of a page */}
                <View wrap={false}>
                  <View
                    style={{
                      backgroundColor: colors.border,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      minHeight: 24,
                    }}
                  >
                    <Text style={[styles.label, { color: colors.background }]}>
                      {category}
                    </Text>
                  </View>
                  {rows[0] && renderRow(rows[0], 0)}
                </View>

                {/* Remaining rows can still break normally across pages */}
                {rows.slice(1).map((col, idx) => renderRow(col, idx + 1))}
              </View>
            );
          },
        )}

        <View
          style={{
            flexDirection: "row",
            paddingVertical: 16,
            backgroundColor: "#f7fee7",
            marginTop: "auto",
            justifySelf: "end",
          }}
          wrap={false}
        >
          <View
            style={{
              paddingHorizontal: 16,
              borderRightWidth: 1,
              borderColor: colors.border,
              flex: 1,
              gap: 8,
            }}
          >
            <Image
              src={process.env.BETTER_AUTH_URL + "/icons/leaf.png"}
              style={{ width: 28, height: 28 }}
            />
            <View>
              <Text style={{ ...styles.label, color: colors.background }}>
                Fresh Quality
              </Text>
              <Text>Hand selected produce</Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              borderRightWidth: 1,
              borderColor: colors.border,
              flex: 1,
              gap: 8,
            }}
          >
            <Image
              src={process.env.BETTER_AUTH_URL + "/icons/price.png"}
              style={{ width: 28, height: 28 }}
            />
            <View>
              <Text style={{ ...styles.label, color: colors.background }}>
                Great Prices
              </Text>
              <Text>Competitive prices every week</Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              flex: 1,
              gap: 8,
            }}
          >
            <Image
              src={process.env.BETTER_AUTH_URL + "/icons/truck.png"}
              style={{ width: 28, height: 28 }}
            />
            <View>
              <Text style={{ ...styles.label, color: colors.background }}>
                Reliable Delivery
              </Text>
              <Text>On time delivery you can count on</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
