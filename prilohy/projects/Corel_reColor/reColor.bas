Attribute VB_Name = "reColor"
Sub reColor()

    Dim s As Shape
    Dim barva As Color
    Dim r As Long, g As Long, b As Long
    Dim i As Integer, pocet As Integer

    ' Definuj seznam povolených barev jako RGB pole
    Dim seznamBarev As Variant
    seznamBarev = Array( _
    Array(255, 0, 0), _
    Array(0, 0, 255), _
    Array(0, 255, 0), _
    Array(255, 0, 255), _
    Array(0, 255, 255), _
    Array(129, 128, 127), _
    Array(255, 127, 0), _
    Array(255, 255, 0), _
    Array(153, 51, 0), _
    Array(128, 0, 128), _
    Array(0, 128, 128), _
    Array(128, 128, 0), _
    Array(255, 51, 153), _
    Array(0, 153, 255), _
    Array(0, 204, 0))
    pocet = 0

    For Each s In ActivePage.Shapes

        If s.Type = cdrCurveShape Then

            If s.Fill.Type = cdrNoFill Then

                If s.Outline.Type <> cdrNoOutline Then

                    Set barva = s.Outline.Color

                    If barva.Type = cdrColorRGB Then

                        r = barva.RGBRed
                        g = barva.RGBGreen
                        b = barva.RGBBlue

                        ' Porovnej s definovanými barvami
                        For i = 0 To UBound(seznamBarev)
                            If r = seznamBarev(i)(0) And g = seznamBarev(i)(1) And b = seznamBarev(i)(2) Then
                                ' Nastav výplò a zruš obrys
                                s.Fill.UniformColor.RGBAssign r, g, b
                                s.Outline.Type = cdrNoOutline
                                pocet = pocet + 1
                                Exit For ' barva odpovídá, netøeba dál kontrolovat
                            End If
                        Next i

                    End If

                End If

            End If

        End If

    Next s

    MsgBox pocet & " køivek bylo upraveno podle zadaných barev."

End Sub


